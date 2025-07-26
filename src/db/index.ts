import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
// Alternative imports for other database types:
// import { drizzle } from 'drizzle-orm/better-sqlite3'
// import Database from 'better-sqlite3'
// import { drizzle } from 'drizzle-orm/mysql2'
// import mysql from 'mysql2/promise'

import * as schema from './schema'

// Database connection configuration
const DATABASE_URL = process.env.SUPABASE_DATABASE_URL!

// PostgreSQL connection (Supabase)
const pool = new Pool({
    connectionString: DATABASE_URL,
})
export const db = drizzle(pool, { schema })

// SQLite connection (commented out)
// const sqlite = new Database(DATABASE_URL)
// export const db = drizzle(sqlite, { schema })

// MySQL connection (commented out)
// const connection = await mysql.createConnection(DATABASE_URL)
// export const db = drizzle(connection, { schema })

export * from './schema' 