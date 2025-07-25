# Drizzle + Supabase Setup

This directory contains the Drizzle ORM setup for interacting with your Supabase PostgreSQL database.

## Setup Instructions

### 1. Environment Variables

Add your Supabase database URL to your `.env.local` file:

```bash
SUPABASE_DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

You can find this URL in your Supabase dashboard under Settings > Database.

### 2. Generate Schema

To pull your existing database schema from Supabase:

```bash
pnpm db:pull
```

This will generate the `drizzle/schema.ts` file with TypeScript types matching your database.

### 3. Available Commands

- `pnpm drizzle` - Run drizzle-kit commands
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:pull` - Pull schema from database

## Usage

### Admin Client (Bypasses RLS)

```typescript
import { getDrizzleSupabaseAdminClient } from '@/lib/db';

const client = getDrizzleSupabaseAdminClient();
const users = await client.select().from(users);
```

### RLS Client (Respects Row Level Security)

```typescript
import { getDrizzleSupabaseClient } from '@/lib/db';

const client = await getDrizzleSupabaseClient();
const users = await client.runTransaction(async (tx) => {
  return await tx.select().from(users);
});
```

### Server Actions

```typescript
'use server';

import { getDrizzleSupabaseClient } from '@/lib/db';

export async function createUser(formData: FormData) {
  const client = await getDrizzleSupabaseClient();
  
  return await client.runTransaction(async (tx) => {
    return await tx.insert(users).values({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }).returning();
  });
}
```

## Important Notes

1. **Server Only**: Drizzle client can only be used in Server Components, Server Actions, and API Routes
2. **RLS Support**: The RLS client respects Supabase Row Level Security policies
3. **Type Safety**: All queries are fully type-safe with TypeScript
4. **Transactions**: Use transactions for complex operations that require multiple queries

## Next Steps

1. Set up your `SUPABASE_DATABASE_URL` environment variable
2. Run `pnpm db:pull` to generate your schema
3. Start using Drizzle in your Server Components and Server Actions
4. Update the example usage files with your actual schema 