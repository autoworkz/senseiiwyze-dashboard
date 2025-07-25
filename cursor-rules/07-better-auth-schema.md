# Better Auth Schema Generation Rules

## Custom Schema Namespace

When working with Better Auth, always use a custom PostgreSQL schema namespace to avoid table collisions:

### Automated Generation Workflow

1. **Use the custom generation command**:
   ```bash
   pnpm auth:generate
   ```
   This command:
   - Runs `npx @better-auth/cli generate -y` to generate the schema
   - Automatically transforms it to use `pgSchema('better_auth')`
   - Creates the necessary migration files

2. **Manual Generation (if needed)**:
   If you need to run the Better Auth CLI directly:
   ```bash
   npx @better-auth/cli generate
   node scripts/transform-auth-schema.js
   ```

### Schema Configuration

Always configure Better Auth to use the transformed schema:

```typescript
// auth.ts
import * as authSchema from "./auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  // ... rest of config
});
```

### Key Benefits

- **No Table Collisions**: All Better Auth tables are in the `better_auth` schema
- **Clean Separation**: Authentication tables are isolated from business logic
- **Easy Migration**: Can coexist with existing auth systems
- **Plugin Support**: All Better Auth plugins work seamlessly

### Database Setup

Before using Better Auth tables, ensure the schema exists:

```sql
CREATE SCHEMA IF NOT EXISTS better_auth;
```

### Important Notes

- The transformation script (`scripts/transform-auth-schema.js`) is idempotent
- It checks if the schema is already transformed before applying changes
- It also creates the migration file for the PostgreSQL schema if it doesn't exist
- Always use `pnpm auth:generate` instead of the raw Better Auth CLI command

### Troubleshooting

If the schema isn't transforming correctly:
1. Check that `scripts/transform-auth-schema.js` exists
2. Ensure the file has executable permissions: `chmod +x scripts/transform-auth-schema.js`
3. Run the transformation manually: `node scripts/transform-auth-schema.js`
4. Check the console output for any errors

### Migration

After generating the schema:
1. Create the PostgreSQL schema: `psql -d your_database -c "CREATE SCHEMA IF NOT EXISTS better_auth;"`
2. Run Drizzle migrations: `pnpm db:generate && pnpm db:push`
3. Or use Better Auth migrations: `pnpm auth:migrate` 