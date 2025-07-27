import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Create SQLite connection
const sqlite = new Database("./sqlite.db");

// Create drizzle instance with schema
export const db = drizzle(sqlite, { schema });