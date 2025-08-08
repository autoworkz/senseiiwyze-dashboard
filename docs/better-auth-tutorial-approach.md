# Better-Auth Tutorial Approach: Dual System Strategy

## Overview 

Following the [official Better-Auth Supabase Migration Guide](https://www.better-auth.com/docs/guides/supabase-migration-guide), this approach maintains **both authentication systems** rather than attempting JWT format bridging.

**Key Insight**: Instead of trying to merge JWT formats, we'll use Better-Auth for **authentication/session management** and Supabase for **database access** with a clean separation of concerns.

---

## Current State Analysis

### What You Already Have ✅
- Better-Auth v1.3.4 fully configured with JWT plugin
- Supabase database connection working
- Existing RLS policies using `auth.uid()`
- User data in Better-Auth format (`ba_` prefixed tables)

### What Needs to Change
- Remove dependency on Supabase Auth JWTs for RLS
- Update RLS policies to work with your data model
- Maintain Better-Auth as primary authentication system

---

## Recommended Architecture

### Authentication Layer: Better-Auth Only
```typescript
// Keep your existing setup in src/lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // Your existing config
  }),
  plugins: [
    jwt(),                    // Keep JWT for API access
    organization(),           // Advanced features you want
    admin(),
    // Add notification plugin when ready
  ]
});
```

### Database Layer: Direct PostgreSQL (No Supabase Auth)
```typescript
// Update src/lib/supabase.ts to remove auth
import { createClient } from '@supabase/supabase-js'

// Use Supabase ONLY for database access, not auth
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },  // Disable Supabase auth
    db: { schema: 'public' }
  }
)
```

---

## RLS Policy Migration Strategy

### Problem: Current RLS Dependencies
Your existing policies use `auth.uid()` which expects Supabase JWTs:

```sql
-- Current policy (won't work with Better-Auth)
using: sql`(auth.uid() = primary_owner_user_id)`
```

### Solution: Application-Level User Context

#### Option 1: Remove RLS, Use Application Security ✅ **Recommended**
```typescript
// src/lib/db-security.ts
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id || null;
}

// In your API routes
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Query with explicit user filtering
  const data = await db
    .select()
    .from(userDataTable)
    .where(eq(userDataTable.userId, userId));
    
  return NextResponse.json(data);
}
```

#### Option 2: Custom RLS with Better-Auth Context
```sql
-- Create custom auth function for Better-Auth
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- Extract user ID from application context
  RETURN current_setting('app.current_user_id', true);
END;
$$;

-- Update policies to use custom function
CREATE POLICY "user_access" ON user_data
FOR ALL USING (user_id = current_user_id()::uuid);
```

```typescript
// Set user context in middleware or API routes
export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (session?.user?.id) {
    // Pass user context to database
    await db.execute(sql`SET LOCAL app.current_user_id = ${session.user.id}`);
  }
  
  return NextResponse.next();
}
```

---

## Migration Steps (Following Tutorial)

### Step 1: Database Connection (Already Done ✅)
Your existing setup already uses the Supabase PostgreSQL database:
```typescript
// lib/db/index.ts - Already configured
export const db = drizzle(pool, {
  schema: {
    ...betterAuthSchema,
    ...applicationSchema
  }
});
```

### Step 2: User Migration (Already Done ✅)
You already have Better-Auth users in the `ba_users` table. No migration needed.

### Step 3: Remove Supabase Auth Dependencies
```typescript
// Remove these if they exist:
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// const supabaseAuth = createClientComponentClient()

// Keep only database client:
import { supabase } from '@/lib/supabase' // Database only
```

### Step 4: Update RLS Policies (Choose One Approach)

#### Approach A: Remove RLS (Simpler) ✅
```sql
-- Disable RLS on tables where you'll handle security in app
ALTER TABLE user_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
-- etc.
```

#### Approach B: Custom RLS Functions (Advanced)
```sql
-- Create custom auth functions (see Option 2 above)
-- Update all policies to use custom functions
```

---

## Code Changes Required

### 1. Update API Routes
```typescript
// src/app/api/user-dashboard/route.ts
import { getCurrentUserId } from '@/lib/db-security'

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return unauthorized();
  
  // Explicit security filtering
  const userData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));
    
  return NextResponse.json(userData);
}
```

### 2. Update Client Components
```typescript
// src/hooks/use-auth.ts - Keep Better-Auth
import { useSession } from '@/lib/auth-client'

export function useAuth() {
  const { data: session, isLoading } = useSession();
  
  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading
  };
}
```

### 3. Database Queries
```typescript
// Always include user context in queries
const getUserData = async (userId: string) => {
  return await db
    .select()
    .from(userDataTable)
    .where(eq(userDataTable.userId, userId));
}

// Instead of relying on RLS auto-filtering
```

---

## Benefits of This Approach

### ✅ Advantages
- **Keep Better-Auth features**: Organizations, admin plugin, JWT, etc.
- **Easy plugin development**: Write notification plugin in TypeScript
- **Gradual migration**: Can be done incrementally
- **No JWT bridging complexity**: Clean separation of concerns
- **Better-Auth ecosystem**: Access to all future plugins

### ⚠️ Considerations
- **Application-level security**: Must be careful about authorization in code
- **RLS migration effort**: Need to update existing policies
- **Session invalidation**: Users will need to re-authenticate once

---

## Next Steps

### Phase 1: Immediate (1-2 days)
1. Remove Supabase auth client usage
2. Update a few API routes to use application-level security
3. Test with existing Better-Auth authentication

### Phase 2: Security Migration (1 week)
1. **Choice A**: Disable RLS and implement app-level security
2. **Choice B**: Create custom RLS functions for Better-Auth context
3. Update all data access patterns

### Phase 3: Plugin Development (Ongoing)
1. Build notification plugin for Better-Auth
2. Add other custom plugins as needed
3. Leverage Better-Auth plugin ecosystem

---

## Plugin Development Example

Since you want to build a notification plugin:

```typescript
// lib/plugins/notification.ts
import type { BetterAuthPlugin } from "better-auth";

export const notification = (): BetterAuthPlugin => {
  return {
    id: "notification",
    endpoints: {
      "/send-notification": {
        method: "POST",
        handler: async (ctx) => {
          const { userId, message, type } = ctx.body;
          
          // Your TypeScript notification logic here
          await sendNotification({ userId, message, type });
          
          return ctx.json({ success: true });
        }
      }
    },
    hooks: {
      after: [
        {
          matcher: (ctx) => ctx.path === "/sign-in",
          handler: async (ctx) => {
            // Send welcome notification after sign-in
            await sendNotification({
              userId: ctx.session.userId,
              message: "Welcome back!",
              type: "info"
            });
          }
        }
      ]
    }
  };
};
```

This approach gives you the best of both worlds: Better-Auth's powerful plugin system while keeping your existing database setup.

---

## Conclusion

The **dual system approach** from the Better-Auth tutorial is much cleaner than JWT bridging:

1. **Better-Auth**: Handles all authentication, sessions, and advanced features
2. **Supabase Database**: Provides PostgreSQL hosting (no auth features)
3. **Application Security**: Handle authorization in your API routes

This lets you keep the Better-Auth plugin ecosystem while avoiding the JWT format compatibility issues entirely.