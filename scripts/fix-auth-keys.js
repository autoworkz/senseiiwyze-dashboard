#!/usr/bin/env node
/**
 * Fix BetterAuth JWT key encryption mismatch
 * This script cleans up existing JWKS when the BETTER_AUTH_SECRET changes
 */

import { Client } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function cleanupJWKS() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    
    console.log('🧹 Cleaning up existing JWKS due to secret change...');
    
    // Delete all existing JWKS - they'll be regenerated with the new secret
    const result = await client.query('DELETE FROM jwks');
    
    console.log(`✅ Cleaned up ${result.rowCount} JWKS records`);
    console.log('ℹ️  New JWKS will be automatically generated on next auth request');
    
  } catch (error) {
    console.error('❌ Failed to cleanup JWKS:', error);
    console.log('💡 You may need to manually delete JWKS records from your database');
  } finally {
    await client.end();
    process.exit(0);
  }
}

cleanupJWKS();