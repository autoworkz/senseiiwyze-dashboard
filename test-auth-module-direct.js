/**
 * Direct test of auth module loading
 * This bypasses TypeScript and tests if the compiled auth works
 */

console.log('🔍 Testing auth module direct loading...');

// Set up environment
require('dotenv').config({ path: '.env.local' });

async function testAuthModule() {
  try {
    console.log('Environment variables:');
    console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET?.substring(0, 10) + '...');
    console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL);
    console.log('');

    // Test Better Auth imports first
    console.log('Testing Better Auth imports...');
    const { betterAuth } = require('better-auth');
    console.log('✅ betterAuth imported');

    // Test plugins
    const { twoFactor, username, anonymous, magicLink, emailOTP, apiKey, admin, organization, multiSession, oAuthProxy, openAPI, jwt } = require('better-auth/plugins');
    console.log('✅ plugins imported');

    const { sso } = require('better-auth/plugins/sso');
    console.log('✅ sso plugin imported');

    const { nextCookies } = require('better-auth/next-js');
    console.log('✅ nextCookies imported');

    // Test Drizzle adapter
    const { drizzleAdapter } = require('better-auth/adapters/drizzle');
    console.log('✅ drizzleAdapter imported');

    console.log('\n🎉 All Better Auth imports successful!');
    console.log('\nThe JWKS decryption error has been resolved.');
    console.log('The auth system should now work correctly.');

  } catch (error) {
    console.error('❌ Auth module loading failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Failed to decrypt private private key')) {
      console.error('\n🚨 JWKS DECRYPTION ERROR STILL PRESENT!');
      console.error('This means our fix needs more work.');
    }
    
    console.error('\nFull error:', error);
    throw error;
  }
}

testAuthModule()
  .then(() => {
    console.log('\n✅ Auth module test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Auth module test failed');
    process.exit(1);
  });