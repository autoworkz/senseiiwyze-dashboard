import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create postgres connection with SSL for Supabase
const queryClient = postgres(process.env.DATABASE_URL!, {
  ssl: 'require'
});

// Create drizzle instance with schema
export const db = drizzle(queryClient, { schema });