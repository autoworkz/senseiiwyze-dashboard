import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/lib/db/drizzle/schema.ts', './auth-schema.ts'],
  out: './src/lib/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // This will use local development DB by default
    url: process.env.SUPABASE_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  },
  schemaFilter: ['public', 'better_auth'],
  verbose: true,
  strict: true,
  // Note: Use 'generate' for migration files, avoid 'push' - migrations will be handled by Bytebase
}); 