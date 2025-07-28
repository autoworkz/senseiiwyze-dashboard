# PostgreSQL Migration Guide

This guide covers the migration from SQLite to PostgreSQL for the SenseiiWyze Dashboard.

## Prerequisites

1. **PostgreSQL Database**: You need access to a PostgreSQL instance
   - **Local**: Install PostgreSQL locally or use Docker
   - **Cloud**: Supabase, Railway, Neon, AWS RDS, etc.

2. **Environment Variables**: Set up your `.env.local` file with database credentials

## Step 1: Database Setup

### Option A: Local PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker run --name senseiiwyze-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=senseiiwyze_dashboard \
  -p 5432:5432 \
  -d postgres:15

# Create .env.local
echo "DATABASE_URL=postgresql://postgres:your_password@localhost:5432/senseiiwyze_dashboard" > .env.local
```

### Option B: Cloud Database (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy your connection string
4. Add to `.env.local`:

```bash
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

## Step 2: Install Dependencies

```bash
# Remove SQLite dependencies
pnpm remove better-sqlite3 @types/better-sqlite3

# PostgreSQL dependencies are already installed:
# - pg (PostgreSQL client)
# - @types/pg (TypeScript types)
```

## Step 3: Run Database Migrations

```bash
# Generate new migrations for PostgreSQL
pnpm db:generate

# Apply migrations to your PostgreSQL database
pnpm db:migrate
```

## Step 4: Verify Migration

```bash
# Test database connection
pnpm test:database

# Run the development server
pnpm dev
```

## Step 5: Data Migration (Optional)

If you have existing SQLite data to migrate:

1. **Export from SQLite**:
   ```bash
   sqlite3 database.sqlite .dump > sqlite_backup.sql
   ```

2. **Import to PostgreSQL** (manual process - adjust SQL syntax as needed):
   - Convert SQLite-specific syntax to PostgreSQL
   - Use `psql` or a GUI tool to import data

## Troubleshooting

### Common Issues

1. **Connection Timeout**:
   - Check your DATABASE_URL format
   - Verify database server is running
   - Check firewall settings

2. **SSL Errors in Production**:
   - Add `?sslmode=require` to your DATABASE_URL
   - Or configure SSL in the Pool options

3. **Migration Errors**:
   - Ensure your PostgreSQL user has CREATE privileges
   - Check that the database exists
   - Verify your connection string

### Database Schema

The PostgreSQL migration maintains the same schema structure:
- `users` table for user accounts
- `sessions` table for authentication sessions  
- `accounts` table for OAuth providers
- `verification` table for email/phone verification
- Plus any plugin-specific tables

## Performance Benefits

PostgreSQL offers several advantages over SQLite:

- **Concurrent Access**: Multiple users can read/write simultaneously
- **Scalability**: Better performance with large datasets
- **Advanced Features**: JSON operations, full-text search, etc.
- **Production Ready**: Suitable for high-traffic applications

## Environment Variables Reference

```bash
# Required
DATABASE_URL=postgresql://username:password@host:port/database

# Optional OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional
NODE_ENV=development
```

## Rollback Plan

If you need to rollback to SQLite:

1. Restore the SQLite configuration files from git
2. Reinstall SQLite dependencies:
   ```bash
   pnpm add better-sqlite3 @types/better-sqlite3
   ```
3. Update auth configuration to use SQLite adapter
4. Run migrations against SQLite database

## Next Steps

After successful migration:

1. Update deployment configuration with PostgreSQL credentials
2. Set up database backups
3. Configure connection pooling for production
4. Monitor database performance 