import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    // Database connection - configured for Supabase PostgreSQL
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.SUPABASE_DATABASE_URL!,
    },

    // Alternative configurations (commented out):

    // For MySQL
    // dialect: 'mysql',
    // dbCredentials: {
    //   url: process.env.DATABASE_URL!,
    // },

    // For SQLite
    // dialect: 'sqlite',
    // dbCredentials: {
    //   url: process.env.DATABASE_URL || './sqlite.db',
    // },

    // Schema and migration settings
    schema: './src/db/schema/*',
    out: './src/db/migrations',

    // Additional options
    verbose: true,
    strict: true,
}) 