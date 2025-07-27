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
import authClient from '../src/lib/auth-client'
import chalk from 'chalk'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

var candidate = "Candidate";

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

  console.log('\n2. Generating GitHub sign-in URL via authClient...')
  const signInData = await authClient.signIn.social({
    provider: 'github'
    // authClient will automatically use configured callback URL
  })

  if (signInData.error) {
    console.log(chalk.red(`   ❌ Sign-in generation failed: ${signInData.error.message}`))
  } else {
    console.log(chalk.green('   ✅ Sign-in URL generated successfully'))
    console.log(`   🔗 Redirect URL (first 100 chars): ${signInData.data?.url?.slice(0, 100)}`)
  }

  // Build expected callback URL based on tutorial guidelines
  // See: https://www.better-auth.com/docs/authentication/github
  const expectedCallbackUrl = `${betterAuthUrl}/api/auth/callback/github`
  console.log(`   Expected callback URL: ${expectedCallbackUrl}`)

  console.log('\n3. Manual verification steps:')
  console.log('   • Run your dev server: pnpm dev')
  console.log('   • Visit the login page and click "Continue with GitHub"')
  console.log('   • Ensure that you are redirected to GitHub and back to:', expectedCallbackUrl)

  console.log('\n✅ GitHub OAuth test script completed!')
}

// Run the test if executed directly
if (require.main === module) {
  testGitHubOAuth().catch(console.error)
}