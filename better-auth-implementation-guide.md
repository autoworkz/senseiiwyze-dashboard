# Better Auth + Drizzle Implementation Guide

## Overview

This guide provides a comprehensive implementation of Better Auth with Drizzle ORM for your Next.js application. Better Auth is a modern, flexible authentication library that offers enhanced security, developer experience, and customization options compared to Supabase Auth.

### Key Benefits
- **Type-safe authentication** with full TypeScript support
- **Flexible database adapters** (Drizzle, Prisma, MongoDB, etc.)
- **Built-in plugins** for admin, anonymous auth, 2FA, and more
- **Enhanced security** with configurable session management
- **Better developer experience** with comprehensive error handling
- **Modern architecture** with server-side rendering support

---

## Prerequisites

### Required Dependencies
- Node.js 18+ 
- pnpm (as per project requirements)
- Supabase PostgreSQL database
- Next.js 15+ with App Router

### Knowledge Requirements
- TypeScript/JavaScript proficiency
- Understanding of authentication flows
- Database migration experience
- Next.js App Router familiarity

---

## Step 1: Install Better Auth Dependencies

### Core Installation

```bash
# Install Better Auth core
pnpm add better-auth

# Install Drizzle adapter and database dependencies
pnpm add drizzle-orm drizzle-kit postgres

# Install development dependencies
pnpm add -D @better-auth/cli @types/pg
```

### Verify Installation

```bash
# Check Better Auth version
pnpm better-auth --version

# Check CLI installation
npx @better-auth/cli --version
```

---

## Step 2: Configure Environment Variables

### Required Environment Variables

Create or update your `.env.local` file:

```env
# Database Configuration
SUPABASE_DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OAuth Provider Credentials (configure as needed)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Email Configuration (if using email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Environment Validation

Create a validation utility:

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  SUPABASE_DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

---

## Step 3: Generate Better Auth Schema

### Generate Database Schema

Better Auth CLI will generate the necessary Drizzle schema:

```bash
# Generate Better Auth schema
npx @better-auth/cli generate
```

This creates `src/lib/db/drizzle/schema.ts` with the following tables:

```typescript
// Generated schema structure
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
  twoFactorEnabled: boolean("two_factor_enabled"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
})

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
})
```

---

## Step 4: Configure Better Auth with Drizzle

### Create Better Auth Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDrizzleSupabaseAdminClient } from "@/lib/db/drizzle-client"
import { env } from "@/lib/env"

// Get the Drizzle client
const db = getDrizzleSupabaseAdminClient()

export const auth = betterAuth({
  // Database configuration with Drizzle adapter
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    usePlural: false, // Better Auth uses singular table names
  }),

  // App configuration
  appName: "SenseiiWyze Dashboard",
  baseURL: env.BETTER_AUTH_URL,

  // Session configuration
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want email verification
  },

  // Social providers configuration
  socialProviders: {
    google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    } : undefined,
    github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    } : undefined,
    discord: env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET ? {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    } : undefined,
  },

  // Trusted origins for OAuth
  trustedOrigins: [
    "http://localhost:3000",
    "https://your-production-domain.com",
  ],

  // Optional: Enable plugins
  plugins: [
    // Add plugins as needed
  ],
})

// Export types for use throughout the app
export type Auth = typeof auth
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>
```

### Enhanced Configuration with Plugins

```typescript
// lib/auth.ts (with plugins)
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, anonymous, twoFactor } from "better-auth/plugins"
import { getDrizzleSupabaseAdminClient } from "@/lib/db/drizzle-client"
import { env } from "@/lib/env"

const db = getDrizzleSupabaseAdminClient()

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: false,
  }),

  appName: "SenseiiWyze Dashboard",
  baseURL: env.BETTER_AUTH_URL,

  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    } : undefined,
    github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    } : undefined,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://your-production-domain.com",
  ],

  // Enhanced plugins configuration
  plugins: [
    // Admin plugin for role-based access
    admin({
      roles: {
        admin: {
          name: "Admin",
          description: "Full system access",
        },
        user: {
          name: "User",
          description: "Standard user access",
        },
      },
    }),

    // Anonymous authentication
    anonymous(),

    // Two-factor authentication
    twoFactor({
      issuer: "SenseiiWyze Dashboard",
    }),
  ],
})
```

---

## Step 5: Create API Routes

### Better Auth API Handler

```typescript
// app/api/auth/[...auth]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

### Protected API Routes

```typescript
// app/api/protected/route.ts
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    message: "Protected data",
    user: session.user,
  })
}
```

---

## Step 6: Create Client-Side Auth Client

### Better Auth Client Configuration

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { adminClient, anonymousClient, twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  
  // Optional: Add client-side plugins
  plugins: [
    adminClient(),
    anonymousClient(),
    twoFactorClient(),
  ],
})

// Export types
export type AuthClient = typeof authClient
```

### React Hooks and Components

```typescript
// hooks/useAuth.ts
import { authClient } from "@/lib/auth-client"

export const useAuth = () => {
  const { data: session, isLoading, error } = authClient.useSession()
  
  return {
    session,
    isLoading,
    error,
    isAuthenticated: !!session,
    user: session?.user,
  }
}

export const useAuthActions = () => {
  return {
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,
    updateUser: authClient.updateUser,
  }
}
```

---

## Step 7: Update Authentication Components

### Modern Login Component

```typescript
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useAuthActions } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { signIn } = useAuthActions()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message)
      } else {
        // Redirect or handle successful login
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github' | 'discord') => {
    try {
      await signIn.social({ provider })
    } catch (err) {
      setError(`Failed to sign in with ${provider}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('discord')}
              disabled={isLoading}
            >
              Discord
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Registration Component

```typescript
// components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useAuthActions } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { signUp } = useAuthActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      if (result.error) {
        setError(result.error.message)
      } else {
        // Handle successful registration
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## Step 8: Implement Middleware

### Authentication Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Auth routes (redirect if already logged in)
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
}
```

---

## Step 9: Database Migration

### Generate and Apply Migrations

```bash
# Generate migration for Better Auth schema
pnpm db:generate

# Apply migration to database
pnpm db:push
```

### Migration Script for Existing Users

If you have existing users from Supabase Auth, create a migration script:

```typescript
// scripts/migrate-users.ts
import { auth } from "@/lib/auth"
import { getDrizzleSupabaseAdminClient } from "@/lib/db/drizzle-client"

const migrateUsers = async () => {
  const db = getDrizzleSupabaseAdminClient()
  const ctx = await auth.$context

  console.log("🚀 Starting user migration...")

  try {
    // Fetch existing users from Supabase auth.users
    const { rows: users } = await db.execute(`
      SELECT 
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data
      FROM auth.users 
      WHERE email IS NOT NULL
    `)

    console.log(`📊 Found ${users.length} users to migrate`)

    for (const user of users) {
      try {
        // Create user in Better Auth
        await ctx.adapter.create({
          model: "user",
          data: {
            id: user.id,
            email: user.email,
            name: user.raw_user_meta_data?.full_name || user.email,
            emailVerified: !!user.email_confirmed_at,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
          },
        })

        // Create account for email/password if password exists
        if (user.encrypted_password) {
          await ctx.adapter.create({
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
        }

        console.log(`✅ Migrated user: ${user.email}`)
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error)
      }
    }

    console.log("🎉 Migration completed!")
  } catch (error) {
    console.error("Migration failed:", error)
  }
}

migrateUsers().catch(console.error)
```

---

## Step 10: Testing Implementation

### Unit Tests

```typescript
// __tests__/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { auth } from '@/lib/auth'

describe('Better Auth Configuration', () => {
  it('should have correct database adapter', () => {
    expect(auth.options.database).toBeDefined()
  })

  it('should have email and password enabled', () => {
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  it('should have social providers configured', () => {
    expect(auth.options.socialProviders).toBeDefined()
  })
})
```

### Integration Tests

```typescript
// __tests__/auth-integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { authClient } from '@/lib/auth-client'

describe('Authentication Flow', () => {
  it('should handle sign up flow', async () => {
    const result = await authClient.signUp.email({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })

    expect(result.data).toBeDefined()
    expect(result.error).toBeNull()
  })

  it('should handle sign in flow', async () => {
    const result = await authClient.signIn.email({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.data).toBeDefined()
    expect(result.error).toBeNull()
  })
})
```

---

## Step 11: Advanced Features

### Two-Factor Authentication

```typescript
// components/auth/TwoFactorSetup.tsx
'use client'

import { useState } from 'react'
import { twoFactorClient } from 'better-auth/client/plugins'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const setupTwoFactor = async () => {
    setIsLoading(true)
    try {
      const result = await twoFactorClient.setup()
      if (result.data) {
        setQrCode(result.data.qrCode)
        setSecret(result.data.secret)
      }
    } catch (error) {
      console.error('Failed to setup 2FA:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTwoFactor = async () => {
    setIsLoading(true)
    try {
      const result = await twoFactorClient.verify({ code: verificationCode })
      if (result.data) {
        // 2FA setup successful
        console.log('2FA setup completed')
      }
    } catch (error) {
      console.error('Failed to verify 2FA:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Set up 2FA to enhance your account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCode ? (
          <Button onClick={setupTwoFactor} disabled={isLoading}>
            Setup 2FA
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Scan this QR code:</p>
              <img src={qrCode} alt="2FA QR Code" className="mt-2" />
            </div>
            <div>
              <p className="text-sm font-medium">Or enter this code manually:</p>
              <p className="text-sm text-muted-foreground">{secret}</p>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button onClick={verifyTwoFactor} disabled={isLoading}>
                Verify
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Admin Panel

```typescript
// components/admin/UserManagement.tsx
'use client'

import { useState, useEffect } from 'react'
import { adminClient } from 'better-auth/client/plugins'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const result = await adminClient.getUsers()
      if (result.data) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await adminClient.updateUser({ id: userId, role })
      await loadUsers() // Reload users
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                >
                  Toggle Role
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Step 12: Deployment Configuration

### Environment Setup

```bash
# Production environment variables
BETTER_AUTH_SECRET=your-production-secret-key
BETTER_AUTH_URL=https://your-domain.com
SUPABASE_DATABASE_URL=your-production-database-url

# OAuth provider credentials
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret
```

### Build Configuration

```json
// package.json scripts
{
  "scripts": {
    "build": "pnpm next build",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "pnpm db:generate && pnpm db:push",
    "auth:generate": "npx @better-auth/cli generate"
  }
}
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Verify database connection
   psql $SUPABASE_DATABASE_URL -c "SELECT 1;"
   
   # Check if Better Auth tables exist
   psql $SUPABASE_DATABASE_URL -c "\dt public.*"
   ```

2. **OAuth Configuration Issues**
   ```typescript
   // Verify OAuth providers are configured
   console.log('Configured providers:', Object.keys(auth.options.socialProviders || {}))
   ```

3. **Session Issues**
   ```typescript
   // Debug session problems
   const session = await authClient.getSession()
   console.log('Current session:', session)
   ```

### Performance Optimization

```typescript
// Enable session caching
export const auth = betterAuth({
  // ... other config
  session: {
    strategy: "jwt",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
})
```

---

## Additional Resources

### Documentation
- [Better Auth Documentation](https://better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Next.js App Router](https://nextjs.org/docs/app)

### Community
- [Better Auth Discord](https://discord.gg/better-auth)
- [GitHub Repository](https://github.com/better-auth/better-auth)
- [Drizzle Discord](https://discord.gg/drizzle)

---

## Conclusion

This implementation provides a robust, modern authentication system with Better Auth and Drizzle ORM. The setup includes:

- **Type-safe authentication** with full TypeScript support
- **Flexible database integration** with Drizzle ORM
- **Social authentication** with multiple providers
- **Advanced features** like 2FA and admin panels
- **Modern React patterns** with hooks and components
- **Comprehensive testing** and deployment setup

The system is production-ready and can be extended with additional plugins and features as needed. 