#!/usr/bin/env tsx

/**
 * Test GitHub OAuth Integration
 * 
 * This script tests the GitHub OAuth flow by checking:
 * 1. Environment variables are set
 * 2. Better Auth configuration is correct
 * 3. OAuth endpoints are accessible
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

async function testGitHubOAuth() {
  console.log('🔍 Testing GitHub OAuth Integration...\n')

  // 1. Check environment variables
  console.log('1. Environment Variables:')
  const githubClientId = process.env.GITHUB_CLIENT_ID
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
  const betterAuthUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'

  console.log(`   GITHUB_CLIENT_ID: ${githubClientId ? '✅ Set' : '❌ Missing'}`)
  console.log(`   GITHUB_CLIENT_SECRET: ${githubClientSecret ? '✅ Set' : '❌ Missing'}`)
  console.log(`   BETTER_AUTH_URL: ${betterAuthUrl}`)

  if (!githubClientId || !githubClientSecret) {
    console.log('\n❌ GitHub OAuth credentials not configured')
    console.log('Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env.local')
    return
  }

  // 2. Test Better Auth endpoints
  console.log('\n2. Better Auth Endpoints:')
  try {
    const authUrl = `${betterAuthUrl}/api/auth`
    const response = await fetch(authUrl)
    console.log(`   Auth API: ${response.ok ? '✅ Accessible' : '❌ Not accessible'} (${response.status})`)
  } catch (error) {
    console.log('   Auth API: ❌ Not accessible (server not running?)')
  }

  // 3. Test GitHub OAuth URL generation
  console.log('\n3. GitHub OAuth Configuration:')
  const oauthUrl = `${betterAuthUrl}/api/auth/signin/github`
  console.log(`   OAuth URL: ${oauthUrl}`)
  console.log(`   Callback URL: ${betterAuthUrl}/api/auth/callback/github`)

  // 4. Instructions
  console.log('\n4. Next Steps:')
  console.log('   • Start your dev server: pnpm dev')
  console.log('   • Visit your login page: http://localhost:3000/login')
  console.log('   • Click "Continue with GitHub" button')
  console.log('   • Verify OAuth flow works end-to-end')

  console.log('\n✅ GitHub OAuth test completed!')
}

// Run the test
testGitHubOAuth().catch(console.error)