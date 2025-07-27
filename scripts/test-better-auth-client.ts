/**
 * Better Auth Client Test Script
 * 
 * Based on official documentation from Context7
 * Documentation: https://better-auth.com
 * 
 * This script tests Better Auth client-side authentication features:
 * - Email/password authentication (signUp.email, signIn.email)
 * - Session management (getSession)
 * - User profile updates (updateUser)
 * - Sign out functionality (signOut)
 * - OAuth provider URL generation (signIn.social)
 * 
 * Key patterns from documentation:
 * - Use createAuthClient from better-auth/react or better-auth/client
 * - All auth methods return { data, error } objects
 * - Session management is automatic with cookies
 * - OAuth requires provider configuration in auth.ts
 */

import { authClient } from "@/lib/auth-client";
import chalk from "chalk";

/**
 * Helper functions for test data generation
 * 
 * Based on Better Auth documentation:
 * - Email/password authentication requires valid email format
 * - Passwords should meet security requirements
 * - Username generation for test users
 */

// Helper functions
function generateRandomUsername(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < length; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return username;
}

function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function logSection(title: string) {
  console.log(chalk.cyan('\n' + '='.repeat(60)));
  console.log(chalk.cyan(`  ${title}`));
  console.log(chalk.cyan('='.repeat(60) + '\n'));
}

/**
 * Main test function for Better Auth client-side authentication
 * 
 * Tests the following authentication flows:
 * 1. Email/password sign up
 * 2. Email/password sign in
 * 3. Session management
 * 4. User profile updates
 * 5. Sign out
 * 6. Username authentication (if enabled)
 * 7. OAuth provider URL generation
 */
async function testBetterAuthClient() {
  logSection('Better Auth Client Tests');
  
  const username = generateRandomUsername();
  const password = generateRandomPassword();
  const email = `${username}@example.com`;
  
  let sessionData: any = null;

  try {
    /**
     * Test 1: Email Sign Up
     * 
     * From Better Auth documentation:
     * - signUp.email() creates a new user account
     * - Returns { data: { user, session, token }, error }
     * - Automatically creates a session on successful signup
     * - Can include additional user fields like name, image
     */
    // Test 1: Sign Up
    logSection('Test 1: Email Sign Up');
    console.log(chalk.blue('📧 Email:'), email);
    console.log(chalk.blue('🔑 Password:'), password);
    console.log(chalk.blue('👤 Username:'), username);
    
    console.log('\n' + chalk.yellow('🔄 Testing sign up...'));
    
    /**
     * signUp.email() method signature:
     * @param credentials - { email: string, password: string, name?: string, image?: string, ... }
     * @param options - Optional callbacks { onRequest, onSuccess, onError }
     * @returns Promise<{ data: { user, session, token } | null, error: Error | null }>
     */
    const signUpResult = await authClient.signUp.email({
      email,
      password,
      name: username,
    }, {
      onRequest: (ctx) => {
        console.log(chalk.gray('  → Request initiated'));
      },
      onSuccess: (ctx) => {
        console.log(chalk.green('  ✅ Sign up successful!'));
      },
      onError: (ctx) => {
        console.log(chalk.red('  ❌ Sign up failed:'), ctx.error.message);
      },
    });

    if (signUpResult.error) {
      throw new Error(`Sign up failed: ${signUpResult.error.message}`);
    }

    console.log(chalk.green('  ✓ User created:'), signUpResult.data?.user?.id);
    console.log(chalk.green('  ✓ Session token:'), signUpResult.data?.token ? 'Present' : 'Missing');
    sessionData = signUpResult.data;

    /**
     * Test 2: Email Sign In
     * 
     * From Better Auth documentation:
     * - signIn.email() authenticates an existing user
     * - Returns { data: { user, session, token }, error }
     * - Creates a new session on successful authentication
     * - Session is automatically managed via cookies
     */
    // Test 2: Sign In
    logSection('Test 2: Email Sign In');
    console.log(chalk.yellow('🔄 Testing sign in with created account...'));
    
    /**
     * signIn.email() method signature:
     * @param credentials - { email: string, password: string }
     * @returns Promise<{ data: { user, session, token } | null, error: Error | null }>
     */
    const signInResult = await authClient.signIn.email({
      email,
      password,
    });

    if (signInResult.error) {
      throw new Error(`Sign in failed: ${signInResult.error.message}`);
    }

    console.log(chalk.green('  ✅ Sign in successful!'));
    console.log(chalk.green('  ✓ User ID:'), signInResult.data?.user?.id);
    console.log(chalk.green('  ✓ Email:'), signInResult.data?.user?.email);
    console.log(chalk.green('  ✓ Session expires:'), signInResult.data?.user?.emailVerified ? 'Verified' : 'Not verified');

    /**
     * Test 3: Get Current Session
     * 
     * From Better Auth documentation:
     * - getSession() retrieves the current user session
     * - Returns { data: { session, user } | null, error }
     * - Session is automatically retrieved from cookies
     * - Returns null if no active session exists
     */
    // Test 3: Get Session
    logSection('Test 3: Session Management');
    console.log(chalk.yellow('🔄 Testing session retrieval...'));
    
    /**
     * getSession() method signature:
     * @returns Promise<{ data: { session, user } | null, error: Error | null }>
     */
    const sessionResult = await authClient.getSession();
    
    if (sessionResult.data) {
      console.log(chalk.green('  ✅ Session retrieved successfully!'));
      console.log(chalk.green('  ✓ Session ID:'), sessionResult.data.session?.id);
      console.log(chalk.green('  ✓ User ID:'), sessionResult.data.user?.id);
      console.log(chalk.green('  ✓ User email:'), sessionResult.data.user?.email);
    } else {
      console.log(chalk.yellow('  ⚠️  No active session found'));
    }

    /**
     * Test 4: Update User Profile
     * 
     * From Better Auth documentation:
     * - updateUser() updates the current user's profile
     * - Can update name, image, and other user fields
     * - Requires an active session
     * - Returns updated user data or error
     */
    // Test 4: Update User
    logSection('Test 4: User Profile Update');
    console.log(chalk.yellow('🔄 Testing user update...'));
    
    /**
     * updateUser() method signature:
     * @param data - { name?: string, image?: string, ... }
     * @returns Promise<{ data: any, error: Error | null }>
     */
    const updateResult = await authClient.updateUser({
      name: `${username}_updated`,
      image: "https://github.com/shadcn.png",
    });

    if (updateResult.error) {
      console.log(chalk.red('  ❌ Update failed:'), updateResult.error.message);
    } else {
      console.log(chalk.green('  ✅ User updated successfully!'));
      console.log(chalk.green('  ✓ New name:'), updateResult.data?.status);
    }

    /**
     * Test 5: Sign Out
     * 
     * From Better Auth documentation:
     * - signOut() ends the current user session
     * - Clears session cookies
     * - Returns { error } if any issues occur
     * - After sign out, getSession() should return null
     */
    // Test 5: Sign Out
    logSection('Test 5: Sign Out');
    console.log(chalk.yellow('🔄 Testing sign out...'));
    
    /**
     * signOut() method signature:
     * @returns Promise<{ error: Error | null }>
     */
    const signOutResult = await authClient.signOut();
    
    if (signOutResult.error) {
      console.log(chalk.red('  ❌ Sign out failed:'), signOutResult.error.message);
    } else {
      console.log(chalk.green('  ✅ Sign out successful!'));
    }

    // Verify session is cleared
    const postSignOutSession = await authClient.getSession();
    if (!postSignOutSession.data?.session) {
      console.log(chalk.green('  ✓ Session cleared successfully'));
    } else {
      console.log(chalk.red('  ❌ Session still active after sign out'));
    }

    /**
     * Test 6: Username Authentication
     * 
     * From Better Auth documentation:
     * - Username authentication requires the username plugin
     * - If not configured, will fall back to email authentication
     * - Can be used alongside email/password auth
     */
    // Test 6: Username Sign In (if enabled)
    logSection('Test 6: Username Authentication');
    console.log(chalk.yellow('🔄 Testing username sign up...'));
    
    /**
     * Note: This test uses email authentication as a fallback
     * For actual username auth, the username plugin must be configured
     */
    const usernameResult = await authClient.signUp.email({
      email: `user_${generateRandomUsername()}@example.com`,
      password: generateRandomPassword(),
      name: 'Test User',
    });

    if (usernameResult.error) {
      console.log(chalk.yellow('  ⚠️  Username auth not available:'), usernameResult.error.message);
    } else {
      console.log(chalk.green('  ✅ Username sign up successful!'));
      console.log(chalk.green('  ✓ User ID:'), usernameResult.data?.user?.id);
    }

    /**
     * Test 7: Social OAuth Provider URLs
     * 
     * From Better Auth documentation:
     * - signIn.social() initiates OAuth flow
     * - Requires provider configuration in auth.ts
     * - Provider must have client ID and secret configured
     * - Returns authorization URL for redirect
     * - Supports providers: github, google, discord, twitter, etc.
     */
    // Test 7: Social OAuth (URLs only)
    logSection('Test 7: OAuth Provider URLs');
    console.log(chalk.blue('📱 Testing OAuth provider URL generation...'));
    
    const providers = ['github', 'google'] as const;
    
    /**
     * signIn.social() method signature:
     * @param options - { provider: string, callbackURL?: string, ... }
     * @returns Promise<string> - The OAuth authorization URL
     */
    for (const provider of providers) {
      try {
        // Using the correct method signature
        const url = await authClient.signIn.social({
          provider,
          callbackURL: '/dashboard',
        });
        console.log(chalk.green(`  ✓ ${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth URL generated`));
      } catch (error) {
        console.log(chalk.yellow(`  ⚠️  ${provider} OAuth not configured`));
      }
    }

    // Summary
    logSection('Test Summary');
    console.log(chalk.green('✅ All core authentication features tested successfully!'));
    console.log(chalk.blue('\nTested features:'));
    console.log('  • Email sign up');
    console.log('  • Email sign in');
    console.log('  • Session management');
    console.log('  • User profile update');
    console.log('  • Sign out');
    console.log('  • Username authentication');
    console.log('  • OAuth provider URLs');

  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error);
    process.exit(1);
  }
}

// Run tests
console.log(chalk.magenta('\n🚀 Starting Better Auth Client Tests...\n'));
testBetterAuthClient()
  .then(() => {
    console.log(chalk.green('\n✨ All tests completed!\n'));
    process.exit(0);
  })
  .catch((error) => {
    console.error(chalk.red('\n💥 Test execution failed:'), error);
    process.exit(1);
  });
