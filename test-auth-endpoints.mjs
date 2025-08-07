#!/usr/bin/env node

/**
 * Test Better Auth HTTP Endpoints
 * This tests the actual HTTP endpoints to ensure the auth system works
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testAuthEndpoints() {
  console.log('🌐 Testing Better Auth HTTP Endpoints');
  console.log('=====================================\n');
  
  const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
  const authEndpoints = [
    '/api/auth/session',
    '/api/auth/sign-in',
    '/api/auth/sign-up',
    '/api/auth/providers'
  ];
  
  console.log(`Base URL: ${baseUrl}\n`);
  
  for (const endpoint of authEndpoints) {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Testing: ${endpoint}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Better-Auth-Test/1.0'
        },
      });
      
      const statusText = response.statusText || 'Unknown';
      
      if (response.status === 200) {
        console.log(`  ✅ ${response.status} ${statusText} - OK`);
      } else if (response.status === 401) {
        console.log(`  ✅ ${response.status} ${statusText} - Expected (no auth)`);
      } else if (response.status === 404) {
        console.log(`  ⚠️  ${response.status} ${statusText} - Endpoint not found`);
      } else if (response.status >= 500) {
        console.log(`  ❌ ${response.status} ${statusText} - Server Error`);
        const errorText = await response.text().catch(() => 'Unable to read response');
        console.log(`     Error: ${errorText.substring(0, 200)}...`);
        
        if (errorText.includes('Failed to decrypt private private key')) {
          console.log(`     🚨 JWKS DECRYPTION ERROR DETECTED!`);
          return false;
        }
      } else {
        console.log(`  ℹ️  ${response.status} ${statusText}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`  ⚠️  Connection refused - Server not running`);
        console.log(`     Start with: mise exec -- pnpm dev`);
      } else {
        console.log(`  ❌ Request failed: ${error.message}`);
      }
    }
  }
  
  console.log('\n💡 To fully test the auth system:');
  console.log('   1. Start development server: mise exec -- pnpm dev');
  console.log('   2. Visit http://localhost:3000/auth/login');
  console.log('   3. Try creating an account and signing in');
  
  return true;
}

testAuthEndpoints().catch(console.error);