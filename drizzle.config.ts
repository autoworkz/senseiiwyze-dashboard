import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/drizzle/schema.ts',
  out: './src/lib/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // This will use local development DB by default
    url: process.env.SUPABASE_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  },
  schemaFilter: ['public'],
  verbose: true,
  strict: true,
}); 