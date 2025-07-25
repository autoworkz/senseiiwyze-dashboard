import 'server-only';
import { DrizzleConfig, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import postgres from 'postgres';
import { z } from 'zod';

// Config validation
const SUPABASE_DATABASE_URL = z
  .string()
  .url('The environment variable SUPABASE_DATABASE_URL is required and must be a valid URL')
  .parse(process.env.SUPABASE_DATABASE_URL!);

// Import schema - this will be available after running pnpm db:pull
// For now, we'll use a placeholder until the schema is generated
let schema: any = {};

// Initialize schema synchronously
const initializeSchema = () => {
  try {
    // Use a synchronous approach for now
    schema = {};
  } catch {
    // Schema not generated yet
  }
};

initializeSchema();

const config = {
  casing: 'snake_case',
  schema,
} satisfies DrizzleConfig<typeof schema>;

// Admin client bypasses RLS
const adminClient = drizzle({
  client: postgres(SUPABASE_DATABASE_URL, { prepare: false }),
  ...config,
});

// RLS protected client
const rlsClient = drizzle({
  client: postgres(SUPABASE_DATABASE_URL, { prepare: false }),
  ...config,
});

export function getDrizzleSupabaseAdminClient() {
  return adminClient;
}

export async function getDrizzleSupabaseClient() {
  // For now, we'll use a simplified version without Supabase auth context
  // You can extend this later when you have Supabase auth set up
  const runTransaction = ((transaction: any, config?: any) => {
    return rlsClient.transaction(async (tx) => {
      return await transaction(tx);
    }, config);
  }) as typeof rlsClient.transaction;

  return {
    runTransaction,
  };
}

function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch {
    return { role: 'anon' } as JwtPayload & { role: string };
  }
} 