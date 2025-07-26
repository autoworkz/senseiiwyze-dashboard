# Database Setup with Drizzle ORM ✅

This project is configured to use Drizzle ORM with **Supabase PostgreSQL**. The database schema has been successfully introspected and is ready for use.

## Current Configuration

**Database**: Supabase PostgreSQL  
**Tables Introspected**: 52 tables, 370 columns, 18 enums  
**Environment Variable**: `SUPABASE_DATABASE_URL`

## Available Tables

The introspection found a comprehensive database with tables including:
- `assessments` - Assessment and evaluation data
- `accounts` - User account management
- `users` - User profiles and data
- `chat_messages` - Chat/messaging system
- `credits_usage` - Credit/billing tracking
- `plans` - Subscription plans
- `nonces` - Security tokens
- `notifications` - Notification system
- And 44+ more tables...

## Files Generated

- ✅ `src/db/schema/schema.ts` - All table definitions (1006 lines)
- ✅ `src/db/schema/relations.ts` - Foreign key relationships (458 lines)
- ✅ `src/db/index.ts` - Database connection configured for PostgreSQL
- ✅ `drizzle.config.ts` - Drizzle configuration for Supabase

## Available Scripts

- `pnpm db:pull` - Re-introspect database (if schema changes)
- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Run pending migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Usage in Code

```typescript
import { db } from '@/db'
import { assessments, users, accounts } from '@/db'

// Example queries with full TypeScript support
const allAssessments = await db.select().from(assessments)

const userAccounts = await db
  .select()
  .from(users)
  .leftJoin(accounts, eq(users.accountId, accounts.id))

// All table schemas are fully typed!
```

## Testing Connection

Run the test connection script:
```bash
npx tsx src/db/test-connection.ts
```

## Drizzle Studio

To explore your database visually:
```bash
pnpm db:studio
```

This will open a web interface at `http://localhost:4983` where you can browse tables, run queries, and manage data.

## Environment Configuration

The database connection uses the `SUPABASE_DATABASE_URL` environment variable from your `.env` file:
```bash
SUPABASE_DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Next Steps

1. ✅ Database introspected successfully
2. ✅ Schema files generated with TypeScript support
3. ✅ Connection configured for Supabase PostgreSQL
4. 🚀 **Ready to use in your application!**

You can now import and use any of the 52 tables with full TypeScript autocomplete and type safety. 