# Better Auth Schema Migration Guide - The Right Way

## Why This Approach is Better

1. **Better Auth knows best** - The CLI generates exactly what Better Auth expects
2. **Easier maintenance** - When Better Auth updates, regenerate and re-apply the schema mapping
3. **Less error-prone** - No risk of missing fields or getting types wrong
4. **Future-proof** - Works with any Better Auth version and plugin updates

## Step-by-Step Process

### 1. Let Better Auth Generate the Schema
```bash
# Let the CLI generate auth-schema.ts
pnpm dlx @better-auth/cli generate
```

### 2. Modify Generated Schema to Use Custom PostgreSQL Schema

After generation, modify `auth-schema.ts` to use `pgSchema`:

```typescript
// BEFORE (generated):
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  // ... fields
});

// AFTER (modified):
import { pgSchema, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Create the better_auth schema
export const betterAuthSchema = pgSchema('better_auth');

// Replace all pgTable with betterAuthSchema.table
export const user = betterAuthSchema.table("user", {
  // ... fields (unchanged)
});

export const session = betterAuthSchema.table("session", {
  // ... fields (unchanged)
});

// And so on for all tables...
```

### 3. Create Schema Migration Script

Create a script to automate the schema transformation:

```bash
# Create the transformation script
touch scripts/transform-auth-schema.js
```

### 4. Use Modified Schema in Auth Configuration

```typescript
// auth.ts
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "./auth-schema"; // Generated and modified

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  // ... rest of config
});
```

### 5. Create Database Schema and Run Migrations

```sql
-- Create the schema first
CREATE SCHEMA IF NOT EXISTS better_auth;

-- Then run your Drizzle migrations
pnpm drizzle-kit push
```

## Automation Script

Create a script to automate the transformation after each generation:

```javascript
// scripts/transform-auth-schema.js
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../auth-schema.ts');
let content = fs.readFileSync(schemaPath, 'utf8');

// Transform pgTable imports to pgSchema
content = content.replace(
  /import { ([^}]+) } from "drizzle-orm\/pg-core"/,
  'import { $1, pgSchema } from "drizzle-orm/pg-core"'
);

// Add schema definition
content = content.replace(
  /import.*\n/g,
  '$&\n// Create the better_auth schema\nexport const betterAuthSchema = pgSchema(\'better_auth\');\n'
);

// Replace all pgTable with betterAuthSchema.table
content = content.replace(/pgTable\(/g, 'betterAuthSchema.table(');

fs.writeFileSync(schemaPath, content);
console.log('✅ Transformed auth-schema.ts to use better_auth schema');
```

## Workflow

```bash
# 1. Generate schema
pnpm dlx @better-auth/cli generate

# 2. Transform to use custom schema
node scripts/transform-auth-schema.js

# 3. Create database schema if needed
psql -d your_db -c "CREATE SCHEMA IF NOT EXISTS better_auth;"

# 4. Run migrations
pnpm drizzle-kit push
```

## Benefits of This Approach

1. **Always up-to-date** - Uses exactly what Better Auth generates
2. **Plugin support** - All plugins work automatically
3. **No manual maintenance** - Just regenerate and transform
4. **Type safety** - All types are correct from Better Auth
5. **Schema isolation** - Tables are in `better_auth` schema, no collisions

## Example Package.json Scripts

```json
{
  "scripts": {
    "auth:generate": "pnpm dlx @better-auth/cli generate",
    "auth:transform": "node scripts/transform-auth-schema.js",
    "auth:setup": "pnpm auth:generate && pnpm auth:transform && pnpm drizzle-kit push",
    "auth:update": "pnpm auth:setup"
  }
}
```

Now you can simply run `pnpm auth:setup` whenever you need to update your auth schema! 