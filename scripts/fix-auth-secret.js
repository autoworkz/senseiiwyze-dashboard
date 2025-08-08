#!/usr/bin/env node

/**
 * Fix Better Auth Secret Issue
 * 
 * This script fixes the "Failed to decrypt private private key" error
 * by clearing the JWKS table that contains keys encrypted with the old secret.
 * 
 * Run: node scripts/fix-auth-secret.js
 */

import { Client } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function clearJWKSTable() {
  console.log('🔧 Starting Better Auth JWKS fix...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Try different possible JWKS table names and clear them all
    const jwksTables = ['jwks', 'ba_jwks', 'ba_jwkss'];
    let totalCleared = 0;
    
    for (const tableName of jwksTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
        const count = parseInt(countResult.rows[0].count);
        console.log(`📊 Found ${count} records in ${tableName}`);
        
        if (count > 0) {
          await client.query(`DELETE FROM ${tableName}`);
          console.log(`🗑️  Cleared ${tableName} table`);
          totalCleared += count;
        }
      } catch (error) {
        console.log(`⚠️  ${tableName} table not found: ${error.message.split('\n')[0]}`);
      }
    }

    const newCount = 0; // All tables should be empty now
    
    console.log(`✅ Cleared ${totalCleared} total JWKS records from all tables`);
    console.log('🎉 Better Auth will regenerate JWKS automatically on next authentication request');
    
  } catch (error) {
    console.error('❌ Error fixing JWKS:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Check required environment variables
if (!process.env.DATABASE_URL && !process.env.SUPABASE_DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL or SUPABASE_DATABASE_URL environment variable');
  process.exit(1);
}

if (!process.env.BETTER_AUTH_SECRET) {
  console.error('❌ Missing BETTER_AUTH_SECRET environment variable');
  process.exit(1);
}

console.log('🔐 Using BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET.substring(0, 10) + '...');

clearJWKSTable().catch(console.error);