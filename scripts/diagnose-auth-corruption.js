#!/usr/bin/env node

/**
 * Diagnose Better Auth Database Corruption
 * 
 * This script identifies all potential sources of corruption in the Better Auth database
 * that could cause JWKS decryption errors and other auth issues.
 */

import { Client } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function diagnoseAuthCorruption() {
  console.log('🔍 Starting Better Auth corruption diagnosis...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // 1. Check table existence and naming conflicts
    console.log('\n📋 Checking table existence...');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%jwks%' 
        OR table_name LIKE 'ba_%' 
        OR table_name LIKE '%user%' 
        OR table_name LIKE '%session%'
      ORDER BY table_name
    `);
    
    console.log('📊 Found tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // 2. Check JWKS tables specifically
    console.log('\n🔐 Checking JWKS tables...');
    
    const jwksTables = ['jwks', 'ba_jwks', 'ba_jwkss'];
    for (const tableName of jwksTables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
        const count = parseInt(result.rows[0].count);
        console.log(`  - ${tableName}: ${count} records`);
        
        if (count > 0) {
          const sample = await client.query(`SELECT id, created_at FROM ${tableName} LIMIT 1`);
          console.log(`    First record: ID=${sample.rows[0]?.id}, Created=${sample.rows[0]?.created_at}`);
        }
      } catch (error) {
        console.log(`  - ${tableName}: Table does not exist or access denied`);
      }
    }

    // 3. Check for encrypted data that might be corrupted
    console.log('\n🔒 Checking for potentially corrupted encrypted data...');
    
    try {
      // Check accounts with tokens (might be encrypted)
      const accountsWithTokens = await client.query(`
        SELECT COUNT(*) as count 
        FROM ba_accounts 
        WHERE access_token IS NOT NULL OR refresh_token IS NOT NULL OR id_token IS NOT NULL
      `);
      console.log(`  - Accounts with OAuth tokens: ${accountsWithTokens.rows[0].count}`);

      // Check API keys (these are hashed/encrypted)
      const apiKeys = await client.query(`SELECT COUNT(*) as count FROM ba_apikeys`);
      console.log(`  - API keys: ${apiKeys.rows[0].count}`);

      // Check two-factor secrets (encrypted)
      const twoFactorSecrets = await client.query(`SELECT COUNT(*) as count FROM ba_two_factors`);
      console.log(`  - Two-factor secrets: ${twoFactorSecrets.rows[0].count}`);

    } catch (error) {
      console.log(`  - Error checking encrypted data: ${error.message}`);
    }

    // 4. Check for schema mismatches
    console.log('\n📐 Checking schema consistency...');
    
    try {
      const userColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ba_users' 
        ORDER BY ordinal_position
      `);
      console.log(`  - ba_users columns: ${userColumns.rows.length}`);

      const sessionColumns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ba_sessions' 
        ORDER BY ordinal_position
      `);
      console.log(`  - ba_sessions columns: ${sessionColumns.rows.length}`);

    } catch (error) {
      console.log(`  - Error checking schema: ${error.message}`);
    }

    // 5. Check for orphaned or corrupted sessions
    console.log('\n🏚️  Checking for orphaned data...');
    
    try {
      const orphanedSessions = await client.query(`
        SELECT COUNT(*) as count
        FROM ba_sessions s
        LEFT JOIN ba_users u ON s.user_id = u.id
        WHERE u.id IS NULL
      `);
      console.log(`  - Orphaned sessions: ${orphanedSessions.rows[0].count}`);

      const orphanedAccounts = await client.query(`
        SELECT COUNT(*) as count
        FROM ba_accounts a
        LEFT JOIN ba_users u ON a.user_id = u.id
        WHERE u.id IS NULL
      `);
      console.log(`  - Orphaned accounts: ${orphanedAccounts.rows[0].count}`);

    } catch (error) {
      console.log(`  - Error checking orphaned data: ${error.message}`);
    }

    console.log('\n🎯 Diagnosis Summary:');
    console.log('  1. Check for JWKS table name conflicts (jwks vs ba_jwks vs ba_jwkss)');
    console.log('  2. Look for encrypted data using old BETTER_AUTH_SECRET');
    console.log('  3. Verify schema consistency between auto-generated and controlled schemas');
    console.log('  4. Clean up orphaned records that might cause reference errors');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
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

diagnoseAuthCorruption().catch(console.error);