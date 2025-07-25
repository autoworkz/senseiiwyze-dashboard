# Better Auth Complete Setup Guide

## Overview

This guide provides a complete setup for Better Auth with Drizzle ORM, including schema generation, migrations, and proper integration with your existing database.

## Prerequisites

- Node.js 18+
- pnpm (as per project requirements)
- Supabase PostgreSQL database
- Next.js 15+ with App Router

## Step 1: Install Dependencies

```bash
# Install Better Auth and related packages
pnpm add better-auth
pnpm add -D @better-auth/cli

# Verify installation
pnpm better-auth --version
```

## Step 2: Environment Configuration

Create or update your `.env.local` file with the required environment variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
SUPABASE_DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Step 3: Generate Better Auth Schema

```bash
# Generate the Better Auth schema
pnpm auth:generate
```

This will create the `auth-schema.ts` file with all necessary tables in the `better_auth` schema.

## Step 4: Update Drizzle Configuration

The `drizzle.config.ts` has been updated to include both schemas:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/lib/db/drizzle/schema.ts', './auth-schema.ts'],
  out: './src/lib/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  },
  schemaFilter: ['public', 'better_auth'],
  verbose: true,
  strict: true,
});
```

## Step 5: Run Migrations

```bash
# Generate and apply migrations
pnpm setup:auth
```

This command will:
1. Generate Better Auth schema
2. Generate Drizzle migrations
3. Apply migrations to your database

## Step 6: Verify Setup

Check that the Better Auth tables were created:

```sql
-- Check Better Auth schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'better_auth' 
ORDER BY table_name;
```

You should see:
- `user`
- `session`
- `account`
- `verification`
- `organization`
- `member`
- `invitation`

## Step 7: Test Authentication

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000/auth/login`
3. Try creating an account and logging in

## Troubleshooting

### Common Issues

1. **Schema not found**: Ensure the `better_auth` schema exists in your database
2. **Permission errors**: Grant proper permissions to your database user
3. **Migration conflicts**: Check for existing tables and resolve conflicts

### Debug Commands

```bash
# Check Better Auth CLI
pnpm better-auth --help

# Generate fresh schema
pnpm auth:generate

# Check database connection
pnpm db:studio

# View migration status
pnpm drizzle-kit migrate --dry-run
```

## Integration with Existing Code

The Better Auth setup is now fully integrated with your existing Drizzle schema. The authentication system will work alongside your existing tables without conflicts.

## Next Steps

1. Update your components to use Better Auth hooks
2. Implement protected routes
3. Add OAuth providers as needed
4. Configure email verification if required 