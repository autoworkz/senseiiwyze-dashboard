/**
 * Database Configuration for Single Supabase Database
 * 
 * This setup handles connections to one Supabase database that contains:
 * 1. Supabase auth schema (auth.users, auth.sessions) - for mobile app
 * 2. Better Auth tables ("user", organization, member) - for dashboard
 * 3. Existing workplaces table - synced with Better Auth organizations
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

// Single database connection (Supabase)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql);

// Supabase client for auth and realtime features
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase configuration is incomplete');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Database cleanup function
 */
export async function closeConnections() {
  await sql.end();
}

/**
 * Health check for database
 */
export async function checkDatabaseHealth() {
  try {
    await sql`SELECT 1`;
    return { connected: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { connected: false, error };
  }
}

/**
 * Check if Better Auth tables exist
 */
export async function checkBetterAuthTables() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'organization', 'member', 'session', 'account')
    `;
    
    const tableNames = tables.map(t => t.table_name);
    return {
      user: tableNames.includes('user'),
      organization: tableNames.includes('organization'),
      member: tableNames.includes('member'),
      session: tableNames.includes('session'),
      account: tableNames.includes('account'),
      allTablesExist: tableNames.length === 5
    };
  } catch (error) {
    console.error('Error checking Better Auth tables:', error);
    return {
      user: false,
      organization: false,
      member: false,
      session: false,
      account: false,
      allTablesExist: false,
      error
    };
  }
}
