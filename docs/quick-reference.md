# Quick Reference: Bytebase Migration Workflow

## 🚀 Daily Workflow

### Making Schema Changes

1. **Edit your schema** in `src/lib/db/drizzle/schema.ts`
2. **Generate migration files**:
   ```bash
   pnpm db:generate
   ```
3. **Review the generated SQL** in `src/lib/db/drizzle/`
4. **Apply via Bytebase** (not Drizzle push!)
5. **Sync local state**:
   ```bash
   pnpm db:pull
   ```

## 📋 Available Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `pnpm db:generate` | Generate migration files | After schema changes |
| `pnpm db:pull` | Sync local state | After Bytebase applies migrations |
| `pnpm fix-schema` | Fix schema imports | Before generating migrations |
| `pnpm migrate:drizzle` | Full workflow (generate only) | Complete migration process |

## ❌ Disabled Commands

| Command | Why Disabled | Alternative |
|---------|-------------|-------------|
| `pnpm db:push` | Bypasses Bytebase | Use `pnpm db:generate` + Bytebase |
| `drizzle-kit push` | Direct database changes | Generate files, apply via Bytebase |

## 🔄 Migration Lifecycle

```
Schema Change → Generate Files → Review SQL → Bytebase Apply → Pull State
     ↓              ↓              ↓            ↓            ↓
  Edit schema   pnpm db:generate  Check files  Upload to    pnpm db:pull
                Review SQL        Bytebase     Apply
```

## 🛠️ Troubleshooting

### "No schema changes" Message
- ✅ **Good**: Schema is in sync
- 🔄 **If you made changes**: Check your schema file

### Migration Conflicts
```bash
pnpm db:pull    # Get current state
pnpm db:generate # Regenerate based on current state
```

### Schema Drift
```bash
pnpm db:pull    # Sync with database
# Manually update schema.ts if needed
pnpm db:generate # Generate new migrations
```

## 📁 File Locations

- **Schema**: `src/lib/db/drizzle/schema.ts`
- **Migrations**: `src/lib/db/drizzle/*.sql`
- **Config**: `drizzle.config.ts`
- **Documentation**: `docs/bytebase-migration-workflow.md`

## 🎯 Best Practices

1. **Always generate first** - never push directly
2. **Review SQL files** before applying
3. **Test in staging** before production
4. **Commit migration files** to git
5. **Use Bytebase approval** for production changes

## 🚨 Common Mistakes

- ❌ Running `pnpm db:push` directly
- ❌ Skipping SQL file review
- ❌ Not pulling state after Bytebase applies
- ❌ Applying to production without staging test 