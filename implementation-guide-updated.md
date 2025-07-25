# Implementation Guide: Migrate from Supabase Auth to Better Auth

## Overview & Goals

This implementation guide provides a comprehensive roadmap for migrating from Supabase Auth to Better Auth while maintaining data integrity and zero downtime. This migration will invalidate all active sessions, but all user data will be preserved.

### Primary Objectives
- Migrate all existing users from Supabase Auth to Better Auth
- Preserve user credentials, social accounts, and metadata
- Implement Better Auth with enhanced features
- Maintain backward compatibility during transition
- Establish robust testing and rollout procedures

### Success Criteria
- All existing users can log in with their current credentials
- Social auth providers work seamlessly
- Enhanced security and flexibility through Better Auth
- Zero data loss during migration
- Improved developer experience

---

## Prerequisites

### Before You Begin

1. **Database Access**: You'll need your Supabase DATABASE_URL to connect to your existing database
2. **Backup Strategy**: Create a full database backup before starting
3. **Development Environment**: Set up a staging environment that mirrors production
4. **OAuth Applications**: Ensure you have access to reconfigure OAuth apps if needed

### Knowledge Requirements
- Understanding of Better Auth concepts
- Database migration experience
- TypeScript/JavaScript proficiency
- Authentication flow understanding

---

## Step 1: Install Better Auth

### Core Dependencies

Install Better Auth and required dependencies:

```bash
npm install better-auth
npm install pg  # For PostgreSQL connection
```

### Development Dependencies

```bash
npm install -D @types/pg
npm install -D @better-auth/cli  # For running migrations
```

### Installation Verification

```bash
# Verify Better Auth installation
node -e "console.log(require('better-auth/package.json').version)"

# Verify CLI installation
npx @better-auth/cli --version
```

---

## Step 2: Configure Better Auth

### Basic Better Auth Setup

Create your Better Auth configuration file:

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
```

### Environment Configuration

```env
# .env.local
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000  # Your app URL
```

### Enable Email Verification (Optional)

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailVerification: {
    sendEmailVerification: async (user) => {
      // Implement your email sending logic here
      console.log("Send verification email to:", user.email)
    },
  },
  emailAndPassword: {
    enabled: true,
  },
})
```

---

## Step 3: Setup Social Providers

### Configure OAuth Providers

Add the social providers you currently use in Supabase:

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
})
```

### Environment Variables for OAuth

```env
# OAuth Provider Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

---

## Step 4: Add Optional Plugins

### Admin and Anonymous Plugins

If you need admin functionality or anonymous authentication, add these plugins:

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { admin, anonymous } from "better-auth/plugins"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    admin(), // Enables admin functionality
    anonymous(), // Enables anonymous authentication
  ],
})
```

---

## Step 5: Create Better Auth Tables

### Run Better Auth Migration

Create the necessary Better Auth tables in your database:

```bash
npx @better-auth/cli migrate
```

This creates the following tables in the `public` schema:
- `user` - Better Auth user table
- `account` - User accounts (email, social providers)
- `session` - User sessions
- `verification` - Email verification tokens

### Verify Table Creation

Check that the tables were created successfully:

```sql
-- Check if Better Auth tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user', 'account', 'session', 'verification');
```

---

## Step 6: Create Migration Script

### Official Migration Script

Create a migration script based on the official Better Auth guide:

```typescript
// migration.ts
import { Pool } from "pg"
import { auth } from "./lib/auth"
import { User as SupabaseUser } from "@supabase/supabase-js"

type User = SupabaseUser & {
  is_super_admin: boolean
  raw_user_meta_data: {
    avatar_url: string
    full_name?: string
  }
  encrypted_password: string
  email_confirmed_at: string
  created_at: string
  updated_at: string
  is_anonymous: boolean
  identities: {
    provider: string
    identity_data: {
      sub: string
      email: string
    }
    created_at: string
    updated_at: string
  }[]
}

const migrateFromSupabase = async () => {
  console.log("🚀 Starting migration from Supabase Auth to Better Auth...")
  
  const ctx = await auth.$context
  const db = ctx.options.database as Pool
  
  // Fetch all users with their identities from Supabase
  const users = await db
    .query(`
      SELECT 
        u.*,
        COALESCE(
          json_agg(
            i.* ORDER BY i.id
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as identities
      FROM auth.users u
      LEFT JOIN auth.identities i ON u.id = i.user_id
      GROUP BY u.id
    `)
    .then((res) => res.rows as User[])
  
  console.log(`📊 Found ${users.length} users to migrate`)
  
  let migratedCount = 0
  let errorCount = 0
  
  for (const user of users) {
    if (!user.email) {
      console.log(`⚠️  Skipping user without email: ${user.id}`)
      continue
    }
    
    try {
      // Create Better Auth user
      await ctx.adapter
        .create({
          model: "user",
          data: {
            id: user.id,
            email: user.email,
            name: user.raw_user_meta_data?.full_name || user.email,
            role: user.is_super_admin ? "admin" : undefined,
            emailVerified: !!user.email_confirmed_at,
            image: user.raw_user_meta_data?.avatar_url,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
            isAnonymous: user.is_anonymous || false,
          },
        })
        .catch(() => {
          // User might already exist, continue with accounts
        })
      
      // Migrate user accounts (credentials and social)
      for (const identity of user.identities) {
        const existingAccounts = await ctx.internalAdapter.findAccounts(user.id)
        
        if (identity.provider === "email") {
          // Migrate email/password credential
          const hasCredential = existingAccounts.find(
            (account) => account.providerId === "credential"
          )
          
          if (!hasCredential) {
            await ctx.adapter
              .create({
                model: "account",
                data: {
                  userId: user.id,
                  providerId: "credential",
                  accountId: user.id,
                  password: user.encrypted_password,
                  createdAt: new Date(user.created_at),
                  updatedAt: new Date(user.updated_at),
                },
              })
              .catch(() => {})
          }
        }
        
        // Migrate social provider accounts
        const supportedProviders = Object.keys(ctx.options.socialProviders || {})
        if (supportedProviders.includes(identity.provider)) {
          const hasAccount = existingAccounts.find(
            (account) => account.providerId === identity.provider
          )
          
          if (!hasAccount) {
            await ctx.adapter.create({
              model: "account",
              data: {
                userId: user.id,
                providerId: identity.provider,
                accountId: identity.identity_data?.sub,
                createdAt: new Date(identity.created_at ?? user.created_at),
                updatedAt: new Date(identity.updated_at ?? user.updated_at),
              },
            })
          }
        }
      }
      
      migratedCount++
      if (migratedCount % 100 === 0) {
        console.log(`✅ Migrated ${migratedCount} users...`)
      }
      
    } catch (error) {
      console.error(`❌ Error migrating user ${user.email}:`, error)
      errorCount++
    }
  }
  
  console.log(`🎉 Migration completed!`)
  console.log(`✅ Successfully migrated: ${migratedCount} users`)
  console.log(`❌ Errors: ${errorCount} users`)
  
  // Close database connection
  await db.end()
}

// Run the migration
migrateFromSupabase().catch(console.error)
```

### Customize the Migration Script (Optional)

Based on your specific needs, you might want to customize:

1. **User Name**: The script uses email as default name. Update if you have `display_name` or similar fields
2. **Social Providers**: Only configured providers in your auth config will be migrated
3. **Role Field**: Remove if not using the admin plugin
4. **Anonymous Users**: Remove `isAnonymous` if not using the anonymous plugin

### Run the Migration

```bash
# Run the migration script
npx tsx migration.ts
# or
node migration.ts
# or
bun migration.ts
```

---

## Step 7: Update Client Code

### Create Better Auth Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})
```

### API Call Migration

Update your existing Supabase auth calls to Better Auth:

#### Sign Up
```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
})

// After (Better Auth)
const { data, error } = await authClient.signUp.email({
  email,
  password,
})
```

#### Sign In with Password
```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// After (Better Auth)
const { data, error } = await authClient.signIn.email({
  email,
  password,
})
```

#### Social Authentication
```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})

// After (Better Auth)
const { data, error } = await authClient.signIn.social({
  provider: 'google',
})
```

#### Sign Out
```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signOut()

// After (Better Auth)
const { data, error } = await authClient.signOut()
```

#### Get Session
```typescript
// Before (Supabase)
const { data: { session } } = await supabase.auth.getSession()

// After (Better Auth)
const session = await authClient.getSession()
// or for reactive state
const { data: session } = authClient.useSession()
```

#### Anonymous Sign In
```typescript
// Before (Supabase)
const { data, error } = await supabase.auth.signInAnonymously()

// After (Better Auth)
const { data, error } = await authClient.signIn.anonymous()
```

---

## Step 8: Update API Routes (Next.js)

### Better Auth API Route

Create a catch-all API route for Better Auth:

```typescript
// pages/api/auth/[...auth].ts or app/api/auth/[...auth]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

### Protected Route Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
```

---

## Step 9: Testing Strategy

### Pre-Migration Testing

1. **Backup Verification**
   ```bash
   # Create backup
   pg_dump $DATABASE_URL > backup.sql
   
   # Verify backup
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM auth.users;"
   ```

2. **Staging Environment**
   - Deploy to staging with production data copy
   - Run migration script on staging
   - Test all authentication flows

### Post-Migration Testing

1. **User Authentication Tests**
   ```typescript
   // Test existing user login
   const testExistingUserLogin = async () => {
     const result = await authClient.signIn.email({
       email: "existing-user@example.com",
       password: "their-existing-password",
     })
     console.log("Existing user login:", result.data ? "✅" : "❌")
   }
   ```

2. **Social Auth Tests**
   ```typescript
   // Test social login redirect
   const testSocialAuth = async () => {
     try {
       await authClient.signIn.social({ provider: "google" })
       console.log("Social auth redirect: ✅")
     } catch (error) {
       console.log("Social auth redirect: ❌", error)
     }
   }
   ```

3. **Session Management Tests**
   ```typescript
   // Test session persistence
   const testSessionPersistence = async () => {
     const { data: session } = authClient.useSession()
     console.log("Session active:", session ? "✅" : "❌")
   }
   ```

---

## Step 10: Rollout Strategy

### Phase 1: Preparation (Week 1)

1. **Environment Setup**
   - Set up staging environment
   - Create database backup
   - Install Better Auth dependencies
   - Configure environment variables

2. **Configuration**
   - Set up Better Auth configuration
   - Configure social providers
   - Add necessary plugins

3. **Initial Testing**
   - Run Better Auth migration to create tables
   - Test basic configuration
   - Validate OAuth provider setup

### Phase 2: Migration (Week 2)

1. **Data Migration**
   - Run migration script on staging
   - Validate data integrity
   - Test user authentication flows
   - Fix any migration issues

2. **Code Updates**
   - Update authentication calls
   - Implement Better Auth client
   - Update API routes
   - Add middleware for protection

3. **Testing**
   - Test existing user logins
   - Test social authentication
   - Test session management
   - Performance testing

### Phase 3: Production Deployment (Week 3)

1. **Pre-deployment**
   - Final staging validation
   - Production backup
   - Deploy configuration changes
   - Run production migration

2. **Rollout**
   - Deploy Better Auth integration
   - Monitor authentication flows
   - Address any immediate issues
   - User communication about session invalidation

3. **Post-deployment**
   - Monitor error rates
   - Validate user adoption
   - Performance monitoring
   - User feedback collection

---

## Troubleshooting

### Common Issues

1. **Migration Errors**
   ```bash
   # Check database connection
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Verify table creation
   psql $DATABASE_URL -c "\dt public.*"
   ```

2. **Authentication Failures**
   ```typescript
   // Debug session issues
   const debugAuth = async () => {
     const session = await authClient.getSession()
     console.log("Current session:", session)
     
     if (!session) {
       console.log("No active session - user needs to login")
     }
   }
   ```

3. **OAuth Configuration**
   ```typescript
   // Verify OAuth providers
   const checkOAuthConfig = () => {
     console.log("Configured providers:", Object.keys(auth.options.socialProviders || {}))
   }
   ```

### Rollback Procedures

If issues arise during migration:

1. **Immediate Rollback**
   ```bash
   # Restore from backup
   psql $DATABASE_URL < backup.sql
   
   # Revert code changes
   git revert <migration-commit>
   ```

2. **Partial Rollback**
   - Keep Better Auth tables
   - Restore original Supabase auth integration
   - Investigate and fix issues
   - Re-attempt migration

---

## Additional Resources

### Better Auth Documentation
- [Basic Usage](https://better-auth.com/docs/concepts/authentication)
- [Email and Password](https://better-auth.com/docs/authentication/email-password)
- [Social Providers](https://better-auth.com/docs/authentication/social)
- [Next.js Integration](https://better-auth.com/docs/integrations/next-js)
- [Middleware](https://better-auth.com/docs/integrations/next-js#middleware)

### Migration Support
- [Official Migration Guide](https://better-auth.com/docs/guides/supabase-migration-guide)
- [Better Auth Discord](https://discord.gg/better-auth)
- [GitHub Issues](https://github.com/better-auth/better-auth/issues)

---

## Conclusion

Congratulations! You've successfully migrated from Supabase Auth to Better Auth. This migration provides:

- **Enhanced Flexibility**: Better Auth offers more customization options
- **Improved Developer Experience**: Type-safe APIs and better error handling
- **Advanced Features**: Built-in plugins for admin, anonymous auth, and more
- **Better Performance**: Optimized authentication flows
- **Future-Proof**: Active development and community support

Be sure to explore the Better Auth documentation to take advantage of its full feature set and continue improving your authentication system.
