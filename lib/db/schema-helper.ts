import { sql } from "drizzle-orm";
import { db } from "./index";

/**
 * Ensure the specified schema exists
 */
export async function ensureSchema(schemaName: string) {
  await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`));
}

/**
 * Set the search path for the current session
 */
export async function setSearchPath(schemaName: string) {
  await db.execute(sql.raw(`SET search_path TO ${schemaName}, public`));
}

/**
 * Initialize database with proper schema
 */
export async function initializeDatabase() {
  const schemaName = process.env.DATABASE_SCHEMA;
  
  if (schemaName && schemaName !== 'public') {
    await ensureSchema(schemaName);
    await setSearchPath(schemaName);
    console.log(`Database initialized with schema: ${schemaName}`);
  }
} 