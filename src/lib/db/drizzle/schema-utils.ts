import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

// Utility functions for the schema
export const gen_random_uuid = () => sql`gen_random_uuid()`;

export const generate_token = (length: number) => sql`encode(gen_random_bytes(${length}), 'hex')`;

// Utility to create a table with at least an id field in a given schema
export const createIdTable = (schemaName: string, tableName: string) => {
    const schema = pgSchema(schemaName);
    return schema.table(tableName, {
        id: text("id").primaryKey().notNull(),
        createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
    });
};

// Example usage for a users table in the 'better_auth' schema:
export const users = createIdTable("auth", "users");

// Export all utilities for easy importing
export const schemaUtils = {
    gen_random_uuid,
    generate_token,
    users
}; 