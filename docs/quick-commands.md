# Quick Commands Reference

## 🚀 Daily Workflow Commands

### Schema Changes
```bash
# 1. Edit schema
vim src/lib/db/drizzle/schema.ts

# 2. Generate migration
pnpm db:generate

# 3. Review SQL
cat src/lib/db/drizzle/*.sql

# 4. Apply via Bytebase (manual)
# 5. Sync local state
pnpm db:pull

# 6. Test
pnpm test
```

### Auth Updates
```bash
# Generate auth schema
pnpm auth:generate

# Apply auth migrations
pnpm auth:migrate

# Test auth
pnpm test
```

## 📋 Essential Commands

| Command | Purpose | Frequency |
|---------|---------|-----------|
| `pnpm db:generate` | Generate migrations | After schema changes |
| `pnpm db:pull` | Sync with database | After Bytebase apply |
| `pnpm auth:generate` | Update auth schema | Auth changes |
| `pnpm test` | Run tests | Before commit |
| `pnpm dev` | Start dev server | Daily development |

## 🔧 Troubleshooting

### Schema Issues
```bash
# Schema out of sync
pnpm db:pull

# Fix imports
pnpm fix-schema

# Regenerate everything
pnpm migrate:drizzle
```

### Auth Issues
```bash
# Regenerate auth
pnpm auth:generate

# Apply auth migrations
pnpm auth:migrate

# Full auth workflow
pnpm migrate:auth
```

## 📊 Status Check

```bash
# Check migration status
pnpm db:generate

# Check auth status
pnpm auth:generate

# Check tests
pnpm test

# Check linting
pnpm lint
```

## 🚨 Emergency Commands

```bash
# Rollback (via Bytebase)
# 1. Go to Bytebase dashboard
# 2. Create rollback migration
# 3. Apply rollback
# 4. Sync local state
pnpm db:pull

# Reset everything (DANGER!)
git reset --hard HEAD
pnpm db:pull
```

---

**Remember**: Always review generated SQL before applying via Bytebase! 