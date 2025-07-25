# Better Auth Custom Schema Implementation Guide

## Overview

This guide demonstrates how to implement Better Auth with a dedicated `better_auth` schema to avoid collisions with existing database tables. We'll also set up multiple authentication plugins (email verification, anonymous, magic link, and OTP).

## Why Use a Separate Schema?

Using a dedicated `better_auth` schema provides several benefits:
- **No Naming Collisions**: Avoids conflicts with existing tables like `users`, `accounts`, `sessions`
- **Clean Separation**: Keeps authentication tables separate from business logic tables
- **Easy Migration**: Can coexist with existing auth systems during migration
- **Plugin Support**: All Better Auth plugins work seamlessly with custom schemas

## Implementation Steps

### 1. Create the Better Auth Schema in Database

First, create the schema in your PostgreSQL database:

```sql
-- Create the better_auth schema
CREATE SCHEMA IF NOT EXISTS better_auth;

-- Grant permissions (adjust based on your database user)
GRANT ALL ON SCHEMA better_auth TO your_database_user;
```

### 2. Define Drizzle Schema with Custom Schema

Create a new file `src/lib/db/better-auth-schema.ts`:

```typescript
import { pgSchema, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Define the better_auth schema
export const betterAuthSchema = pgSchema('better_auth');

// Core Tables
export const user = betterAuthSchema.table('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled'),
  username: text('username').unique(),
  displayUsername: text('display_username'),
});

export const session = betterAuthSchema.table('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = betterAuthSchema.table('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = betterAuthSchema.table('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export const twoFactor = betterAuthSchema.table('two_factor', {
  id: text('id').primaryKey(),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

// Plugin Tables

// Organization Plugin Tables
export const organization = betterAuthSchema.table('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
});

export const member = betterAuthSchema.table('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const invitation = betterAuthSchema.table('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  invitedBy: text('invited_by').notNull().references(() => user.id),
});

// Anonymous User Plugin
export const anonymousUser = betterAuthSchema.table('anonymous_user', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  metadata: text('metadata'), // JSON stored as text
});

// Magic Link Plugin
export const magicLink = betterAuthSchema.table('magic_link', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
});

// OTP Plugin
export const otp = betterAuthSchema.table('otp', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(), // email or phone
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  attempts: integer('attempts').default(0).notNull(),
});

// Email Verification Plugin (uses verification table above)
// No additional tables needed - uses the core verification table

// Export all schema tables
export const betterAuthDrizzleSchema = {
  user,
  session,
  account,
  verification,
  twoFactor,
  organization,
  member,
  invitation,
  anonymousUser,
  magicLink,
  otp,
};
```

### 3. Configure Better Auth with Custom Schema

Update your `auth.ts` file:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { 
  organization, 
  anonymous,
  magicLink,
  emailOTP,
  twoFactor
} from "better-auth/plugins";
import { db } from "./database";
import * as betterAuthSchema from "./lib/db/better-auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: betterAuthSchema.betterAuthDrizzleSchema,
  }),
  appName: "senseiiwyze-dashboard",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Core authentication methods
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
  // Email configuration
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Implement your email sending logic
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Click here to verify your email</a>`,
      });
    },
  },
  
  plugins: [
    nextCookies(),
    
    // Organization support
    organization({
      allowUserToCreateOrganization: true,
      schema: {
        organization: {
          modelName: "organization",
        },
        member: {
          modelName: "member",
        },
        invitation: {
          modelName: "invitation",
        },
      },
    }),
    
    // Anonymous authentication
    anonymous({
      // Allows users to use the app without signing up
      sessionDuration: 60 * 60 * 24 * 30, // 30 days
    }),
    
    // Magic link authentication
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        await sendEmail({
          to: email,
          subject: "Your magic login link",
          html: `<a href="${url}">Click here to login</a>`,
        });
      },
      // Customize link expiration (default: 5 minutes)
      expiresIn: 60 * 10, // 10 minutes
    }),
    
    // Email OTP authentication
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendEmail({
          to: email,
          subject: "Your verification code",
          html: `Your verification code is: <strong>${otp}</strong>`,
        });
      },
      otpLength: 6,
      expiresIn: 60 * 5, // 5 minutes
    }),
    
    // Two-factor authentication
    twoFactor({
      issuer: "SenseiiWyze Dashboard",
    }),
  ],
});

export type Auth = typeof auth;
```

### 4. Run Migrations

Create a migration file to set up the schema:

```sql
-- db/migrations/001_better_auth_schema.sql

-- Create schema
CREATE SCHEMA IF NOT EXISTS better_auth;

-- Run the Better Auth CLI to generate the full schema
-- Then apply it with the schema prefix
```

Or use Drizzle Kit:

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit migrate
```

### 5. Configure Drizzle Config

Update your `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/better-auth-schema.ts",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  // Include the better_auth schema in migrations
  schemaFilter: ["better_auth", "public"],
} satisfies Config;
```

## How It Works in Practice

### 1. Schema Isolation

All Better Auth tables are created in the `better_auth` schema:
- `better_auth.user`
- `better_auth.session`
- `better_auth.account`
- `better_auth.organization`
- etc.

Your existing tables remain in the `public` schema:
- `public.profiles`
- `public.accounts`
- `public.projects`
- etc.

### 2. Query Examples

```typescript
// Better Auth handles the schema automatically
const user = await auth.api.getUser({ userId });

// Direct database queries would use schema prefix
const users = await db
  .select()
  .from(betterAuthSchema.user)
  .where(eq(betterAuthSchema.user.email, email));
```

### 3. Adding More Plugins

To add more plugins later:

```typescript
// 1. Import the plugin
import { passkey } from "better-auth/plugins";

// 2. Add to plugins array
plugins: [
  // ... existing plugins
  passkey({
    rpName: "SenseiiWyze",
    rpID: "senseiiwyze.com",
    origin: "https://senseiiwyze.com",
  }),
]

// 3. Add schema tables if needed
export const passkey = betterAuthSchema.table('passkey', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  credentialId: text('credential_id').notNull().unique(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  createdAt: timestamp('created_at').notNull(),
});
```

## Benefits of This Approach

1. **No Collisions**: Complete isolation from existing auth tables
2. **Easy Rollback**: Can switch back to old auth without data loss
3. **Gradual Migration**: Can run both auth systems in parallel
4. **Plugin Flexibility**: All plugins work with the custom schema
5. **Type Safety**: Full TypeScript support with Drizzle
6. **Performance**: PostgreSQL schemas have no performance overhead

## Common Operations

### Check Schema Exists
```sql
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'better_auth';
```

### List All Better Auth Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'better_auth';
```

### Grant Permissions
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO your_user;
```

## Next Steps

1. Create the database schema
2. Run migrations to create tables
3. Test authentication flows
4. Migrate existing user data if needed
5. Update your application to use Better Auth

This approach gives you a clean, collision-free implementation of Better Auth with full plugin support! 