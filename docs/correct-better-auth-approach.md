# Correct Better Auth Custom Schema Approach

## The Right Way: Generate + Modify

Instead of manually creating schemas, we should:

1. **Generate with Better Auth CLI**
2. **Modify to use custom PostgreSQL schema**
3. **Migrate accordingly**

## Step 1: Let Better Auth Generate

```bash
npx @better-auth/cli generate
# Press Y to overwrite - let it generate auth-schema.ts
```

## Step 2: Modify Generated Schema

Take the generated `auth-schema.ts` and modify it:

```typescript
// Change this line at the top:
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// To this:
import { pgSchema, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// Add this line after imports:
const betterAuthSchema = pgSchema('better_auth');

// Then change all pgTable calls to use the schema:
// Before:
export const user = pgTable("user", {
  // ...
});

// After:
export const user = betterAuthSchema.table("user", {
  // ...
});
```

## Step 3: Update All Tables

Apply the same pattern to all tables:
- `user` → `betterAuthSchema.table("user", ...)`
- `session` → `betterAuthSchema.table("session", ...)`
- `account` → `betterAuthSchema.table("account", ...)`
- `verification` → `betterAuthSchema.table("verification", ...)`
- etc.

## Step 4: Create Schema Migration

```sql
-- migrations/001_create_better_auth_schema.sql
CREATE SCHEMA IF NOT EXISTS better_auth;
```

## Step 5: Generate Drizzle Migration

```bash
pnpm drizzle-kit generate
```

This will create migration files that:
- Create tables in the `better_auth` schema
- Include all Better Auth's expected fields
- Work with all plugins out of the box

## Benefits of This Approach

✅ **Always up-to-date** - Regenerate when Better Auth updates
✅ **Plugin support** - All plugins work automatically  
✅ **Type safety** - Generated types match Better Auth expectations
✅ **No collisions** - Tables live in separate schema
✅ **Maintainable** - Simple to regenerate and re-apply schema mapping

## Example Script for Automation

```bash
#!/bin/bash
# scripts/update-better-auth-schema.sh

echo "Generating Better Auth schema..."
npx @better-auth/cli generate

echo "Applying schema modifications..."
# Use sed or a simple script to replace pgTable with betterAuthSchema.table
sed -i 's/pgTable(/betterAuthSchema.table(/g' auth-schema.ts
sed -i '1i const betterAuthSchema = pgSchema("better_auth");' auth-schema.ts
sed -i 's/import { pgTable,/import { pgSchema,/' auth-schema.ts

echo "Generating Drizzle migration..."
pnpm drizzle-kit generate

echo "Done! Review the migration files before applying."
```

This approach is much cleaner and more maintainable than manually creating schemas. 