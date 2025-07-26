# Better Auth with Existing Supabase Database - Implementation Guide

## Overview

This guide demonstrates how to implement Better Auth with an existing Supabase database without running migrations. We'll leverage Better Auth's extensible plugin system while maintaining your current database schema.

## Important: Schema Configuration

⚠️ **This implementation uses a dedicated `better_auth` schema** in your Supabase database to keep authentication tables separate from your application tables. The Better Auth tables (`user`, `session`, `account`, `verification`) are stored in the `better_auth` schema while your application data remains in other schemas (e.g., `auth` schema for application-specific tables).

## Prerequisites

- Existing Supabase project with authentication tables
- Node.js 18+ installed
- PostgreSQL connection string from Supabase

## Step 1: Installation

First, install Better Auth and required dependencies:

```bash
pnpm add better-auth drizzle-orm postgres
pnpm add -D @types/pg
```

## Step 2: Database Schema Introspection

Before configuring Better Auth, let's understand your existing Supabase auth schema. Supabase typically uses these tables:

- `auth.users` - User accounts
- `auth.identities` - OAuth provider identities  
- `auth.sessions` - Active user sessions
- `auth.refresh_tokens` - Refresh tokens for sessions

### Pulling Schema from Existing Database

Create a script to introspect your current schema:

```typescript
// scripts/introspect-schema.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function introspectAuthSchema() {
  try {
    // Get column information for auth tables
    const result = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'auth'
      AND table_name IN ('users', 'identities', 'sessions', 'refresh_tokens')
      ORDER BY table_name, ordinal_position;
    `);

    console.log('Existing Auth Schema:');
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await pool.end();
  }
}

introspectAuthSchema();
```

## Step 3: Configure Better Auth with Drizzle

Based on your existing schema, we'll first create Drizzle schema definitions and then configure Better Auth:

### Create Drizzle Schema

```typescript
// lib/db/schema.ts
import { pgTable, uuid, text, timestamp, jsonb, boolean, pgSchema } from "drizzle-orm/pg-core";

// Create auth schema
export const authSchema = pgSchema("auth");

// Define the existing Supabase auth.users table
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  emailConfirmedAt: timestamp("email_confirmed_at"),
  rawUserMetaData: jsonb("raw_user_meta_data").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  isAnonymous: boolean("is_anonymous").default(false),
});

// Define the existing Supabase auth.sessions table
export const sessions = authSchema.table("sessions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Define the existing Supabase auth.identities table
export const identities = authSchema.table("identities", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  provider: text("provider").notNull(),
  providerId: text("provider_id").notNull(),
  identityData: jsonb("identity_data").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Create Drizzle Database Instance

```typescript
// lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create postgres connection
const queryClient = postgres(process.env.DATABASE_URL!);

// Create drizzle instance with schema
export const db = drizzle(queryClient, { schema });
```

### Configure Better Auth with Drizzle Adapter

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      // Map Better Auth models to our Drizzle schema tables
      user: schema.users,
      session: schema.sessions,
      account: schema.identities,
    },
  }),

  // Configure authentication options
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // Add base URL for your app
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Configure secret
  secret: process.env.BETTER_AUTH_SECRET,
});

// Export typed auth client
export type Auth = typeof auth;
```

## Step 4: Install Authentication APIs

Create API routes to handle authentication requests:

### Create the Better Auth API Route Handler

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### Create Authentication Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import type { Auth } from "./auth";

export const authClient = createAuthClient<Auth>({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
});

// Export hooks for React components
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
```

### Environment Variables

Add these to your `.env.local`:

```bash
# Database URL from Supabase
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/postgres"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
```

## Step 5: Plugin System Usage

Better Auth's plugin system allows you to extend functionality easily. Here are some powerful plugin examples:

### Two-Factor Authentication Plugin

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins/two-factor";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.identities,
    },
  }),
  
  plugins: [
    twoFactor({
      issuer: "Your App Name",
      // Optional: custom storage for 2FA secrets
      totpOptions: {
        // TOTP configuration
        period: 30,
        digits: 6,
      },
    }),
  ],
});
```

### OAuth Providers Plugin

```typescript
// lib/auth.ts
import { github, google, discord } from "better-auth/plugins/oauth";

export const auth = betterAuth({
  // ... base configuration
  
  plugins: [
    github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
});
```

### Magic Link Authentication

```typescript
// lib/auth.ts
import { magicLink } from "better-auth/plugins/magic-link";

export const auth = betterAuth({
  // ... base configuration
  
  plugins: [
    magicLink({
      sendMagicLink: async (email, url, user) => {
        // Send email using your email service
        await sendEmail({
          to: email,
          subject: "Your Magic Link",
          html: `<a href="${url}">Click here to sign in</a>`,
        });
      },
      // Optional: customize link expiration
      expiresIn: 60 * 15, // 15 minutes
    }),
  ],
});
```

### Session Management Plugin

```typescript
// lib/auth.ts
import { sessionManagement } from "better-auth/plugins/session-management";

export const auth = betterAuth({
  // ... base configuration
  
  plugins: [
    sessionManagement({
      // Extend session on activity
      extendOnActivity: true,
      // Session duration
      sessionMaxAge: 60 * 60 * 24 * 7, // 7 days
      // Allow multiple sessions per user
      allowMultipleSessions: true,
    }),
  ],
});
```

### Custom Plugin Example

Create your own plugin to extend Better Auth:

```typescript
// lib/plugins/user-profile.ts
import { BetterAuthPlugin } from "better-auth";

export const userProfile = (): BetterAuthPlugin => {
  return {
    id: "user-profile",
    
    // Add custom endpoints
    endpoints: {
      updateProfile: {
        method: "POST",
        path: "/profile/update",
        handler: async ({ body, context }) => {
          const { user } = await context.getSession();
          if (!user) {
            throw new Error("Unauthorized");
          }
          
          // Update user profile in database
          await context.db.update(users)
            .set({ 
              rawUserMetaData: {
                ...user.rawUserMetaData,
                ...body,
              },
            })
            .where(eq(users.id, user.id));
            
          return { success: true };
        },
      },
    },
    
    // Extend user object
    onUserCreated: async ({ user, context }) => {
      // Initialize profile data
      await context.db.update(users)
        .set({
          rawUserMetaData: {
            preferences: {
              theme: "light",
              notifications: true,
            },
          },
        })
        .where(eq(users.id, user.id));
    },
  };
};
```

### Using Plugins in Your App

```typescript
// components/auth-example.tsx
"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";

export function AuthExample() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  
  if (!session) {
    return (
      <div>
        <button onClick={() => signIn.social({ provider: "github" })}>
          Sign in with GitHub
        </button>
        <button onClick={() => signIn.magicLink({ email: "user@example.com" })}>
          Send Magic Link
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <p>Welcome, {session.user.email}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Key Benefits Recap

1. **No Migrations Required**: Works with your existing Supabase auth tables
2. **Type Safety**: Full TypeScript support with Drizzle ORM
3. **Extensible**: Rich plugin ecosystem for common auth features
4. **Flexible**: Create custom plugins for your specific needs
5. **Production Ready**: Battle-tested authentication system

## Next Steps

1. Test your authentication flow
2. Add necessary plugins for your use case
3. Customize the auth UI components
4. Implement proper error handling
5. Set up monitoring and logging

For more information, visit the [Better Auth documentation](https://better-auth.com).