import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

// SQL template literals (not functions) - following Drizzle documentation patterns
export const genRandomUuidSql = sql`gen_random_uuid()`;

// Common token generation SQL (32 bytes = 64 hex chars)
export const generateToken32Sql = sql`encode(gen_random_bytes(32), 'hex')`;

// For dynamic token lengths, provide a function (but use sparingly in defaults)
export const generateTokenSql = (length: number) => sql`encode(gen_random_bytes(${length}), 'hex')`;

// Utility to create a table with at least an id field in a given schema
export const createIdTable = (schemaName: string, tableName: string) => {
    const schema = pgSchema(schemaName);
    return schema.table(tableName, {
        id: text("id").primaryKey().notNull(),
        createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
    });
};

// Example usage for a users table in the 'auth' schema:
export const users = createIdTable("auth", "users");

// Export utilities following Drizzle patterns
export const schemaUtils = {
    // Export SQL template literals directly (not functions)
    genRandomUuid: genRandomUuidSql,
    generateToken32: generateToken32Sql,

    // For dynamic use (avoid in .default() calls)
    generateTokenSql,

    // Table reference
    users
}; 