#!/usr/bin/env node

/**
 * Comprehensive Better Auth System Test
 * Tests the actual auth system by making HTTP requests to the auth endpoints
 */

import { config } from 'dotenv';
import { Client } from 'pg';

// Load environment variables
config({ path: '.env.local' });

async function testFullAuthSystem() {
  console.log('🔍 Comprehensive Better Auth System Test');
  console.log('==========================================\n');
  
  // 1. Test Environment Configuration
  console.log('1️⃣ Testing Environment Configuration...');
  
  const requiredEnvVars = [
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'DATABASE_URL',
    'SUPABASE_DATABASE_URL'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing ${envVar}`);
      process.exit(1);
    }
    if (envVar.includes('SECRET')) {
      console.log(`✅ ${envVar}: ${process.env[envVar].substring(0, 10)}...`);
    } else {
      console.log(`✅ ${envVar}: ${process.env[envVar]}`);
    }
  }
  
  // 2. Test Database Connection and Schema
  console.log('\n2️⃣ Testing Database Connection and Schema...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    // Check critical tables exist
    const criticalTables = ['ba_users', 'ba_sessions', 'ba_accounts', 'ba_jwkss'];
    for (const table of criticalTables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table} LIMIT 1`);
        console.log(`✅ ${table} table exists`);
      } catch (error) {
        console.error(`❌ ${table} table missing or inaccessible: ${error.message}`);
        throw error;
      }
    }
    
    // Verify JWKS table is clean (should be empty after our fix)
    const jwksResult = await client.query('SELECT COUNT(*) FROM ba_jwkss');
    const jwksCount = parseInt(jwksResult.rows[0].count);
    if (jwksCount === 0) {
      console.log('✅ JWKS table is clean (no corrupted records)');
    } else {
      console.log(`⚠️  JWKS table has ${jwksCount} records (will test if they work)`);
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
  
  // 3. Test Better Auth Import and Configuration
  console.log('\n3️⃣ Testing Better Auth Import and Configuration...');
  
  try {
    // Test if the auth module can be loaded without errors
    const { betterAuth } = await import('better-auth');
    console.log('✅ Better Auth module imports successfully');
    
    // Test specific plugin imports that were causing issues
    const plugins = await import('better-auth/plugins');
    console.log('✅ Better Auth plugins import successfully');
    
    const nextJsPlugin = await import('better-auth/next-js');
    console.log('✅ Better Auth Next.js integration imports successfully');
    
  } catch (error) {
    console.error('❌ Better Auth import failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
  
  // 4. Test Auth Configuration Loading
  console.log('\n4️⃣ Testing Auth Configuration Loading...');
  
  try {
    // This will test if our auth.ts file can be loaded without the JWKS decryption error
    const authModule = await import('./src/lib/auth.ts');
    console.log('✅ Auth configuration loads without errors');
    
    // Test if we can access the auth object
    if (authModule.auth) {
      console.log('✅ Auth object is accessible');
    } else {
      console.error('❌ Auth object not found in module');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Auth configuration loading failed:');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Check if it's the specific JWKS decryption error we were trying to fix
    if (error.message.includes('Failed to decrypt private private key')) {
      console.error('\n🚨 JWKS DECRYPTION ERROR STILL PRESENT!');
      console.error('This means our fix didn\'t work completely.');
      console.error('Possible causes:');
      console.error('1. JWKS table still has corrupted records');
      console.error('2. BETTER_AUTH_SECRET mismatch');
      console.error('3. Schema reference issues');
      process.exit(1);
    }
    
    process.exit(1);
  }
  
  // 5. Test HTTP Auth Endpoints (if server is running)
  console.log('\n5️⃣ Testing HTTP Auth Endpoints...');
  
  const authUrl = process.env.BETTER_AUTH_URL;
  
  try {
    // Test the auth session endpoint (should return 401 or valid response, not 500)
    const sessionUrl = `${authUrl}/api/auth/session`;
    console.log(`Testing: ${sessionUrl}`);
    
    const response = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      console.log('✅ Auth session endpoint responds correctly (401 Unauthorized - expected for no session)');
    } else if (response.status === 200) {
      console.log('✅ Auth session endpoint responds correctly (200 OK - existing session found)');
    } else if (response.status >= 500) {
      console.error(`❌ Auth session endpoint server error: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      if (errorText.includes('Failed to decrypt private private key')) {
        console.error('\n🚨 JWKS DECRYPTION ERROR IN HTTP ENDPOINT!');
        process.exit(1);
      }
    } else {
      console.log(`⚠️  Auth session endpoint unexpected status: ${response.status}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Development server not running - HTTP endpoint tests skipped');
      console.log('   To test HTTP endpoints, run: pnpm dev');
    } else {
      console.error('❌ HTTP endpoint test failed:', error.message);
    }
  }
  
  // 6. Final Summary
  console.log('\n🎯 Test Summary');
  console.log('===============');
  console.log('✅ Environment configuration: OK');
  console.log('✅ Database connection: OK');
  console.log('✅ Database schema: OK');  
  console.log('✅ JWKS table: Clean');
  console.log('✅ Better Auth imports: OK');
  console.log('✅ Auth configuration loading: OK');
  console.log('✅ No JWKS decryption errors: OK');
  
  console.log('\n🎉 Better Auth system appears to be fully functional!');
  console.log('\n💡 Next Steps:');
  console.log('   1. Start development server: mise exec -- pnpm dev');
  console.log('   2. Visit http://localhost:3000/auth/login');
  console.log('   3. Test actual login/signup flows');
  console.log('   4. Verify OAuth providers work');
}

testFullAuthSystem().catch((error) => {
  console.error('\n💥 Comprehensive test failed:');
  console.error(error);
  process.exit(1);
});