import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

// Config validation
const SUPABASE_DATABASE_URL = z
  .string()
  .url('The environment variable SUPABASE_DATABASE_URL is required and must be a valid URL')
  .parse(process.env.SUPABASE_DATABASE_URL!);

// Create the database connection
// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(SUPABASE_DATABASE_URL, { prepare: false });

// Create the Drizzle instance
export const db = drizzle(client); 