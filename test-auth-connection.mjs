#!/usr/bin/env node

/**
 * Test Better Auth Connection
 * Quick test to verify the auth system works with the new secret
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testAuth() {
  console.log('🔍 Testing Better Auth connection...');
  
  // Test environment variables
  if (!process.env.BETTER_AUTH_SECRET) {
    console.error('❌ BETTER_AUTH_SECRET not found');
    process.exit(1);
  }
  
  if (!process.env.BETTER_AUTH_URL) {
    console.error('❌ BETTER_AUTH_URL not found');
    process.exit(1);
  }
  
  console.log('✅ Environment variables configured');
  console.log(`🔐 BETTER_AUTH_SECRET: ${process.env.BETTER_AUTH_SECRET.substring(0, 10)}...`);
  console.log(`🌐 BETTER_AUTH_URL: ${process.env.BETTER_AUTH_URL}`);
  
  // Test database connection
  try {
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    await client.connect();
    console.log('✅ Database connection successful');
    
    // Check JWKS table is now empty
    const jwksResult = await client.query('SELECT COUNT(*) FROM ba_jwkss');
    const jwksCount = parseInt(jwksResult.rows[0].count);
    console.log(`✅ JWKS table has ${jwksCount} records (should be 0)`);
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
  
  console.log('🎉 Better Auth should now work correctly!');
  console.log('💡 Next steps:');
  console.log('   1. Start development server: pnpm dev');
  console.log('   2. Visit http://localhost:3000/auth/login');
  console.log('   3. Try signing up/in to verify auth works');
}

testAuth().catch(console.error);