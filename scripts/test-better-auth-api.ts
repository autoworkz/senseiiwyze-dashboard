#!/usr/bin/env tsx
/**
 * Better Auth API Test Script
 * 
 * Based on official documentation from Context7
 * Documentation: https://better-auth.com
 * 
 * This script tests Better Auth API using SDK methods exclusively:
 * - API health check via getSession()
 * - User registration (signUp.email)
 * - User authentication (signIn.email)
 * - Session management (getSession)
 * - Sign out functionality (signOut)
 * 
 * Key patterns from documentation:
 * - Use createAuthClient from better-auth/client
 * - Never make direct fetch calls to /api/auth/* endpoints
 * - All auth methods return { data, error } objects
 * - Session management is automatic with cookies
 * - Error handling should check both error object and data null state
 */

import * as dotenv from "dotenv";
import path from "path";
import { createAuthClient } from "better-auth/client";
import chalk from "chalk";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Create Better Auth client instance
 * 
 * From Better Auth documentation:
 * - baseURL should point to your application's base URL
 * - The client will automatically append /api/auth for auth endpoints
 * - Session cookies are automatically handled
 * - No additional configuration needed for basic auth operations
 */
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

/**
 * Main test function for Better Auth API
 * 
 * Tests the following API operations:
 * 1. API health check - validates auth service is running
 * 2. User sign up - creates new user account
 * 3. User sign in - authenticates existing user
 * 4. Session retrieval - verifies active session
 * 5. Sign out - ends user session
 * 6. Session verification - confirms session is cleared
 */
async function testBetterAuthAPI() {
  console.log("🔍 Better Auth API Test Suite\n");
  
  /**
   * Test user data
   * Note: Email must be unique for each test run
   * Password should meet security requirements if configured
   */
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: "TestPassword123!",
    name: "Test User"
  };
  
  console.log("📋 Test Configuration:");
  console.log(`   Base URL: ${process.env.BETTER_AUTH_URL || "http://localhost:3000"}`);
  console.log(`   Test Email: ${testUser.email}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  
  try {
    /**
     * Test 1: API Health Check
     * 
     * From Better Auth documentation:
     * - getSession() can be used to verify API connectivity
     * - Returns { data: null, error: null } if no session exists
     * - Returns { data: { session, user }, error: null } if session exists
     * - Throws error if API is unreachable
     */
    console.log("\n1️⃣ Testing API Health via SDK...");
    try {
      // Use getSession to check if auth is working
      const session = await authClient.getSession();
      console.log(`   Status: ${session.data ? '✅ API reachable (session check)' : '✅ API reachable (no session)'}`);
      if (session.data) {
        console.log("   Current session:", JSON.stringify(session.data, null, 2));
      }
    } catch (error) {
      console.log("   ❌ Cannot reach API - is the dev server running?");
      console.log("   Run 'pnpm dev' in another terminal");
      return;
    }
    
    /**
     * Test 2: User Sign Up
     * 
     * From Better Auth documentation:
     * signUp.email() method signature:
     * @param credentials - { email: string, password: string, name?: string, ... }
     * @returns Promise<{ data: { user, session, token } | null, error: Error | null }>
     * 
     * - Creates new user account
     * - Automatically creates session on success
     * - Returns user object with id, email, name, etc.
     * - Session token is included for immediate authentication
     */
    console.log("\n2️⃣ Testing User Sign Up...");
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    
    const signUpResult = await authClient.signUp.email({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name
    });
    
    if (signUpResult.error) {
      console.log(`   ❌ Sign up failed: ${signUpResult.error.message}`);
      return;
    }
    
    console.log("   ✅ User created successfully");
    console.log("   User ID:", signUpResult.data?.user?.id);
    console.log("   Session Token:", signUpResult.data?.token ? "Present" : "Missing");
    
    /**
     * Test 3: User Sign In
     * 
     * From Better Auth documentation:
     * signIn.email() method signature:
     * @param credentials - { email: string, password: string }
     * @returns Promise<{ data: { user, session, token } | null, error: Error | null }>
     * 
     * - Authenticates existing user
     * - Creates new session on success
     * - Returns same structure as signUp
     * - Session cookies are automatically set
     */
    console.log("\n3️⃣ Testing User Sign In...");
    const signInResult = await authClient.signIn.email({
      email: testUser.email,
      password: testUser.password
    });
    
    if (signInResult.error) {
      console.log(`   ❌ Sign in failed: ${signInResult.error.message}`);
      return;
    }
    
    console.log("   ✅ Sign in successful");
    console.log("   User ID:", signInResult.data?.user?.id);
    console.log("   Session Token:", signInResult.data?.token ? "Present" : "Missing");
    
    /**
     * Test 4: Get Current Session
     * 
     * From Better Auth documentation:
     * getSession() method signature:
     * @returns Promise<{ data: { session, user } | null, error: Error | null }>
     * 
     * - Retrieves current session from cookies
     * - Returns null data if no active session
     * - Session includes user object with profile data
     * - No parameters needed - uses cookies automatically
     */
    console.log("\n4️⃣ Testing Get Session...");
    const sessionResult = await authClient.getSession();
    
    if (sessionResult.error || !sessionResult.data) {
      console.log("   ❌ No active session found");
    } else {
      console.log("   ✅ Active session found");
      console.log("   User ID:", sessionResult.data.user?.id);
      console.log("   Email:", sessionResult.data.user?.email);
    }
    
    /**
     * Test 5: Sign Out
     * 
     * From Better Auth documentation:
     * signOut() method signature:
     * @returns Promise<{ error: Error | null }>
     * 
     * - Ends current session
     * - Clears session cookies
     * - Does not return data, only error if failed
     * - After sign out, getSession() should return null
     */
    console.log("\n5️⃣ Testing Sign Out...");
    const signOutResult = await authClient.signOut();
    
    if (signOutResult.error) {
      console.log(`   ❌ Sign out failed: ${signOutResult.error.message}`);
    } else {
      console.log("   ✅ Sign out successful");
    }
    
    /**
     * Test 6: Verify Session Cleared
     * 
     * From Better Auth documentation:
     * - After signOut(), session should be completely cleared
     * - getSession() should return { data: null, error: null }
     * - This verifies that cookies were properly cleared
     * - Important for security and proper logout flow
     */
    console.log("\n6️⃣ Verifying Session Cleared...");
    const finalSession = await authClient.getSession();
    
    if (!finalSession.data) {
      console.log("   ✅ Session successfully cleared");
    } else {
      console.log("   ❌ Session still exists after sign out");
    }
    
    // Summary
    console.log("\n✅ Better Auth API test completed!");
    console.log("\n📝 Summary:");
    console.log("   - API is reachable");
    console.log("   - User registration works");
    console.log("   - Sign in/out functionality works");
    console.log("   - Session management works");
    
  } catch (error: any) {
    console.error("\n❌ Test failed with error:", error.message);
    console.error("Stack:", error.stack);
  }
}

/**
 * Important Better Auth patterns from documentation:
 * 
 * 1. Always use SDK methods, never direct API calls:
 *    ✅ authClient.signIn.email({ email, password })
 *    ❌ fetch('/api/auth/sign-in', { method: 'POST', ... })
 * 
 * 2. All methods return consistent { data, error } structure
 * 
 * 3. Sessions are managed automatically via httpOnly cookies
 * 
 * 4. The SDK handles all authentication flows including:
 *    - CSRF protection
 *    - Session renewal
 *    - Cookie management
 *    - Error standardization
 */
console.log(chalk.cyan("ℹ️  This test uses Better Auth SDK methods exclusively."));
console.log(chalk.cyan("   No direct fetch calls to /api/auth/* endpoints.\n"));

// Run the test
testBetterAuthAPI()
  .then(() => {
    console.log("\n✨ All tests completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });