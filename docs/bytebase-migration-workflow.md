# Bytebase Migration Workflow

## Overview

This project uses **Bytebase** for database migrations instead of Drizzle's `push` command. This provides better control, versioning, and rollback capabilities for database schema changes.

## Why Bytebase?

- **Better Version Control**: Full migration history and rollback capabilities
- **Team Collaboration**: Review and approve schema changes
- **Environment Management**: Separate staging and production migrations
- **Audit Trail**: Track who made what changes and when
- **Safety**: Prevents accidental schema changes

## Workflow

### 1. Generate Migration Files

```bash
# Generate migration files from schema changes
pnpm db:generate

# This creates SQL files in src/lib/db/drizzle/
# Example: 0005_add_user_preferences.sql
```

### 2. Review Generated Migrations

Check the generated SQL files in `src/lib/db/drizzle/` to ensure they're correct:

```sql
-- Example migration file
CREATE TABLE "user_preferences" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  "userId" uuid NOT NULL,
  "theme" text DEFAULT 'light',
  "createdAt" timestamp DEFAULT now()
);
```

### 3. Apply via Bytebase

1. **Upload Migration Files**: Add the generated SQL files to your Bytebase project
2. **Review & Approve**: Use Bytebase's review process to validate changes
3. **Deploy**: Apply migrations to your target environments (staging, production)

### 4. Update Migration History

After Bytebase applies the migration, update your local migration state:

```bash
# Pull the current database state to sync migration history
pnpm db:pull
```

## Commands

### Available Commands

```bash
# Generate migration files (use this instead of push)
pnpm db:generate

# Pull current database state
pnpm db:pull

# Fix schema imports before generating
pnpm fix-schema

# Full migration workflow (generate only)
pnpm migrate:drizzle
```

### Disabled Commands

```bash
# ❌ DO NOT USE - This bypasses Bytebase
pnpm db:push

# ❌ DO NOT USE - This includes push
pnpm migrate:drizzle  # (old version that included push)
```

## Best Practices

### 1. Always Generate First

```bash
# ✅ Correct workflow
pnpm db:generate
# Review generated SQL files
# Apply via Bytebase
pnpm db:pull  # Sync state after Bytebase applies
```

### 2. Test Migrations

- Test migrations in a staging environment first
- Use Bytebase's preview feature to see what will change
- Verify rollback procedures work

### 3. Version Control

- Commit generated migration files to git
- Include migration files in pull requests
- Document breaking changes

### 4. Environment Management

- Use different Bytebase projects for staging/production
- Apply migrations to staging first
- Use Bytebase's approval workflows for production

## Troubleshooting

### Migration Conflicts

If you get conflicts between local and remote schema:

```bash
# Pull the current state from database
pnpm db:pull

# Regenerate migrations based on current state
pnpm db:generate
```

### Schema Drift

If your local schema doesn't match the database:

```bash
# Pull the current database schema
pnpm db:pull

# Manually sync your schema.ts with the pulled schema
# Then generate new migrations for your changes
pnpm db:generate
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Generate Migrations
on:
  pull_request:
    paths:
      - 'src/lib/db/drizzle/schema.ts'

jobs:
  generate-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm db:generate
      - name: Check for migration files
        run: |
          if [ -n "$(find src/lib/db/drizzle -name '*.sql' -newer .git/HEAD)" ]; then
            echo "New migration files detected"
            exit 0
          else
            echo "No new migration files"
            exit 0
          fi
```

## Migration File Structure

```
src/lib/db/drizzle/
├── 0000_initial_schema.sql
├── 0001_add_users_table.sql
├── 0002_add_user_preferences.sql
├── meta/
│   ├── _journal.json
│   └── 0000_snapshot.json
└── schema.ts
```

## Bytebase Configuration

Ensure your Bytebase project is configured to:

1. **Track Migration History**: Enable migration tracking
2. **Review Process**: Require approval for production changes
3. **Environment Separation**: Separate staging and production
4. **Backup Strategy**: Automatic backups before migrations

## Security Considerations

- Never commit database credentials to version control
- Use environment variables for database connections
- Enable Bytebase's audit logging
- Restrict database access to Bytebase service accounts only 