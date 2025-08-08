# JWT Integration Implementation Strategy

## Strategic Recommendation: Supabase Auth Migration

Based on the comprehensive analysis, **migrating to Supabase Auth** is the recommended approach for merging JWT systems. This strategy minimizes risk while maintaining system security and performance.

---

## Implementation Roadmap

### Phase 1: Foundation & Preparation (Week 1-2)

#### 1.1 Environment Setup
```bash
# Install Supabase Auth dependencies
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-ui-react
npm install @supabase/auth-ui-shared
```

#### 1.2 Dual Authentication Setup
```typescript
// src/lib/supabase-auth.ts - New Supabase auth client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabaseAuth = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
})
```

#### 1.3 Database Schema Analysis
- Audit existing user data in Better-Auth tables
- Map fields to Supabase auth.users schema
- Plan custom metadata migration

### Phase 2: User Data Migration (Week 2-3)

#### 2.1 Migration Script Development
```typescript
// scripts/migrate-users-to-supabase.ts
import { auth as betterAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function migrateUsers() {
  // 1. Export Better-Auth users
  const betterAuthUsers = await getBetterAuthUsers()
  
  // 2. Transform to Supabase format
  const supabaseUsers = betterAuthUsers.map(user => ({
    email: user.email,
    email_confirmed_at: user.emailVerified ? new Date() : null,
    user_metadata: {
      name: user.name,
      role: user.role,
      // Map Better-Auth fields to metadata
    },
    app_metadata: {
      better_auth_id: user.id, // Keep reference
      migrated_at: new Date(),
    }
  }))
  
  // 3. Create Supabase users via Admin API
  for (const user of supabaseUsers) {
    await supabase.auth.admin.createUser(user)
  }
}
```

#### 2.2 Role & Permission Migration
```typescript
// Map Better-Auth B2B2C roles to Supabase
const roleMapping = {
  // Better-Auth → Supabase
  'ceo': 'authenticated',
  'worker': 'authenticated', 
  'frontliner': 'authenticated',
  'learner': 'authenticated',
  'admin': 'authenticated',
  'executive': 'authenticated'
}

// Store detailed roles in app_metadata
const migrateUserRole = (betterAuthUser) => ({
  app_metadata: {
    role: betterAuthUser.role, // Detailed role
    permissions: getUserPermissions(betterAuthUser.role),
    organization_id: betterAuthUser.organizationId
  }
})
```

### Phase 3: Authentication Flow Migration (Week 3-4)

#### 3.1 Update Auth Configuration
```typescript
// src/lib/auth-supabase.ts - Replace Better-Auth
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email,
    email: user.email,
    role: user.app_metadata?.role || 'learner',
    organizationId: user.app_metadata?.organization_id,
    emailVerified: !!user.email_confirmed_at,
  }
}
```

#### 3.2 Client-Side Migration
```typescript
// src/hooks/use-auth.ts - Replace Better-Auth client
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export function useAuth() {
  const user = useUser()
  const supabase = useSupabaseClient()
  
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }
  
  const signOut = async () => {
    return await supabase.auth.signOut()
  }
  
  return { user, signIn, signOut, isLoading: !user }
}
```

#### 3.3 Update API Routes
```typescript
// src/app/api/auth/callback/route.ts - Supabase auth callback
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  return NextResponse.redirect(requestUrl.origin + '/app')
}
```

### Phase 4: Database Security Migration (Week 4-5)

#### 4.1 Update RLS Policies
```sql
-- Update existing policies to use Supabase auth.uid()
-- BEFORE (Better-Auth):
CREATE POLICY "user_access" ON user_data
FOR ALL USING (user_id = auth.uid());

-- AFTER (Supabase - no change needed!):
CREATE POLICY "user_access" ON user_data  
FOR ALL USING (user_id = auth.uid());
```

#### 4.2 Role-Based Policies
```sql
-- Use app_metadata for detailed roles
CREATE POLICY "admin_access" ON admin_data
FOR ALL USING (
  auth.jwt() ->> 'app_metadata' ->> 'role' IN ('admin', 'worker', 'frontliner')
);

-- Organization access
CREATE POLICY "org_access" ON organization_data
FOR ALL USING (
  organization_id = (auth.jwt() ->> 'app_metadata' ->> 'organization_id')::uuid
);
```

### Phase 5: Testing & Validation (Week 5-6)

#### 5.1 Authentication Testing
```typescript
// tests/auth-migration.test.ts
describe('Auth Migration', () => {
  test('user login with migrated account', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'migrated-user@example.com',
      password: 'test-password'
    })
    
    expect(error).toBeNull()
    expect(data.user?.app_metadata.better_auth_id).toBeDefined()
  })
  
  test('RLS policies work with Supabase JWT', async () => {
    // Test data access with new JWT format
    const { data } = await supabase
      .from('user_data')
      .select('*')
      
    expect(data).toBeDefined()
  })
})
```

#### 5.2 Rollback Plan
```typescript
// Keep Better-Auth tables during migration
// Allow rollback to Better-Auth if issues arise
const rollbackPlan = {
  1: 'Keep ba_ tables intact during migration',
  2: 'Maintain Better-Auth endpoints in parallel',
  3: 'Feature flag for auth system selection',
  4: 'Data synchronization scripts'
}
```

---

## Alternative Strategy: Custom PostgreSQL Extension

If Better-Auth features are critical to preserve:

### Phase 1: Custom Auth Functions
```sql
-- Custom function to extract Better-Auth JWT claims
CREATE OR REPLACE FUNCTION better_auth_uid()
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_claims jsonb;
  user_id text;
BEGIN
  -- Get JWT claims from current request
  jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
  
  -- Extract user ID from Better-Auth JWT
  user_id := jwt_claims ->> 'sub';
  
  IF user_id IS NULL OR user_id = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN user_id::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;
```

### Phase 2: JWT Middleware
```typescript
// src/middleware/jwt-bridge.ts
export function createJWTBridge() {
  return async (request: NextRequest) => {
    const betterAuthJWT = request.cookies.get('better-auth-session')?.value
    
    if (betterAuthJWT) {
      const claims = jwt.decode(betterAuthJWT) as any
      
      // Transform to Supabase-compatible format
      const supabaseJWT = jwt.sign({
        sub: claims.sub,
        role: 'authenticated',
        email: claims.email,
        aal: 'aal1',
        session_id: claims.sessionId,
        is_anonymous: false,
        // Custom claims for Better-Auth compatibility
        better_auth_role: claims.role,
        better_auth_org: claims.organizationId
      }, process.env.SUPABASE_JWT_SECRET!)
      
      // Set JWT for database context
      request.headers.set('Authorization', `Bearer ${supabaseJWT}`)
    }
    
    return NextResponse.next({ request })
  }
}
```

### Phase 3: Update RLS Policies
```sql
-- Use custom function instead of auth.uid()
CREATE POLICY "user_access" ON user_data
FOR ALL USING (user_id = better_auth_uid());

-- Access Better-Auth specific claims
CREATE POLICY "role_access" ON protected_data  
FOR ALL USING (
  auth.jwt() ->> 'better_auth_role' IN ('admin', 'worker')
);
```

---

## Risk Mitigation Strategies

### 1. Gradual Migration
- Run both auth systems in parallel
- Feature flags for auth system selection
- Gradual user migration batches

### 2. Data Backup
```bash
# Backup Better-Auth tables
pg_dump -t 'ba_*' $DATABASE_URL > better_auth_backup.sql

# Backup application data
pg_dump -t '!ba_*' $DATABASE_URL > app_data_backup.sql
```

### 3. Monitoring & Rollback
```typescript
// Monitor authentication success rates
const authMetrics = {
  betterAuthLogins: 0,
  supabaseLogins: 0,
  failures: 0
}

// Automatic rollback triggers
if (authMetrics.failures / authMetrics.supabaseLogins > 0.1) {
  // Trigger rollback to Better-Auth
  enableBetterAuthFallback()
}
```

---

## Success Metrics

### Technical Metrics
- [ ] 100% user data migrated successfully
- [ ] All RLS policies functional with new JWTs
- [ ] Authentication success rate > 99%
- [ ] API response times unchanged (±10ms)

### Business Metrics  
- [ ] Zero user-facing authentication issues
- [ ] No data access disruptions
- [ ] Maintained security compliance
- [ ] Preserved all user roles and permissions

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1** | 1-2 weeks | Environment setup, dual auth |
| **Phase 2** | 2-3 weeks | User data migration |
| **Phase 3** | 3-4 weeks | Auth flow migration |
| **Phase 4** | 4-5 weeks | Database security updates |
| **Phase 5** | 5-6 weeks | Testing & validation |

**Total Timeline**: 5-6 weeks for complete migration

---

## Conclusion

The **Supabase Auth migration strategy** provides:
- ✅ Lowest risk and complexity
- ✅ Maintains database security model  
- ✅ Standard authentication patterns
- ✅ Future compatibility with Supabase ecosystem

This approach resolves the JWT format incompatibility while preserving the security and performance characteristics of the current system.