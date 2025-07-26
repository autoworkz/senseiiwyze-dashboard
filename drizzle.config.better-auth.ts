import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/db/better-auth-schema.ts',
    out: './db/migrations/better-auth',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
    },
    verbose: true,
    strict: true,
}); 