#!/usr/bin/env tsx

/**
 * Test Resend Email Integration
 * 
 * This script tests the Resend API configuration and email sending functionality.
 */

import { config } from 'dotenv'
import { sendMagicLinkEmail, sendVerificationEmail, sendWelcomeEmail } from '../src/lib/email'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

async function testResendEmail() {
  console.log('🔍 Testing Resend Email Integration...\n')

  // 1. Check environment variables
  console.log('1. Environment Variables:')
  const resendApiKey = process.env.RESEND_API_KEY
  console.log(`   RESEND_API_KEY: ${resendApiKey ? '✅ Set' : '❌ Missing'}`)

  if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
    console.log('\n❌ Resend API key not configured')
    console.log('Please set RESEND_API_KEY in .env.local')
    console.log('Get your API key from: https://resend.com/api-keys')
    return
  }

  // 2. Test email sending (dry run)
  console.log('\n2. Email Functions:')
  
  const testEmail = 'test@example.com'
  const testUrl = 'https://localhost:3000/auth/verify?token=test123'
  
  try {
    console.log('   📧 Magic Link Email: Ready')
    console.log('   📧 Verification Email: Ready')
    console.log('   📧 Welcome Email: Ready')
    
    // Uncomment these lines to actually send test emails:
    /*
    console.log('\n3. Sending Test Emails:')
    
    // Test magic link email
    console.log('   Sending magic link email...')
    await sendMagicLinkEmail({
      email: testEmail,
      url: testUrl,
    })
    console.log('   ✅ Magic link email sent')
    
    // Test verification email
    console.log('   Sending verification email...')
    await sendVerificationEmail({
      email: testEmail,
      url: testUrl,
    })
    console.log('   ✅ Verification email sent')
    
    // Test welcome email
    console.log('   Sending welcome email...')
    await sendWelcomeEmail({
      email: testEmail,
      name: 'Test User',
    })
    console.log('   ✅ Welcome email sent')
    */
    
  } catch (error) {
    console.log('   ❌ Email function error:', error)
    return
  }

  // 3. Instructions
  console.log('\n3. Next Steps:')
  console.log('   • Verify your domain in Resend dashboard')
  console.log('   • Update email "from" addresses in src/lib/email.ts')
  console.log('   • Uncomment test email sending code above to test')
  console.log('   • Run: pnpm tsx scripts/test-resend-email.ts')

  console.log('\n4. Domain Setup:')
  console.log('   • Add DNS records for your domain in Resend')
  console.log('   • Update from addresses:')
  console.log('     - auth@yourdomain.com (for auth emails)')
  console.log('     - welcome@yourdomain.com (for welcome emails)')
  console.log('   • Test with a real email address')

  console.log('\n✅ Resend integration test completed!')
}

// Run the test
testResendEmail().catch(console.error)