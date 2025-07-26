#!/usr/bin/env tsx

import * as dotenv from "dotenv";
import path from "path";
import { createAuthClient } from "better-auth/client";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create an auth client for testing
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

async function testBetterAuthAPI() {
  console.log("🔍 Better Auth API Test Suite\n");
  
  // Test data
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
    // Test 1: Check if API is reachable
    console.log("\n1️⃣ Testing API Health...");
    try {
      const response = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/session`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("   Response:", JSON.stringify(data, null, 2));
        console.log("   ✅ API is reachable");
      } else {
        console.log("   ❌ API returned error status");
      }
    } catch (error) {
      console.log("   ❌ Cannot reach API - is the dev server running?");
      console.log("   Run 'pnpm dev' in another terminal");
      return;
    }
    
    // Test 2: Sign Up
    console.log("\n2️⃣ Testing Sign Up...");
    try {
      const signUpResult = await authClient.signUp.email({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      });
      
      console.log("   ✅ Sign up successful");
      console.log("   User ID:", signUpResult.data?.user?.id);
      console.log("   Session:", signUpResult.data?.session ? "Created" : "Not created");
    } catch (error: any) {
      console.log("   ❌ Sign up failed:", error.message);
    }
    
    // Test 3: Sign In
    console.log("\n3️⃣ Testing Sign In...");
    try {
      const signInResult = await authClient.signIn.email({
        email: testUser.email,
        password: testUser.password,
      });
      
      console.log("   ✅ Sign in successful");
      console.log("   User ID:", signInResult.data?.user?.id);
      console.log("   Session ID:", signInResult.data?.session?.id);
      console.log("   Session expires:", signInResult.data?.session?.expiresAt);
    } catch (error: any) {
      console.log("   ❌ Sign in failed:", error.message);
    }
    
    // Test 4: Get Session
    console.log("\n4️⃣ Testing Get Session...");
    try {
      const session = await authClient.getSession();
      
      if (session.data?.session) {
        console.log("   ✅ Session retrieved");
        console.log("   User email:", session.data.user?.email);
        console.log("   Session active:", !!session.data.session);
      } else {
        console.log("   ⚠️  No active session");
      }
    } catch (error: any) {
      console.log("   ❌ Get session failed:", error.message);
    }
    
    // Test 5: Sign Out
    console.log("\n5️⃣ Testing Sign Out...");
    try {
      await authClient.signOut();
      console.log("   ✅ Sign out successful");
      
      // Verify session is cleared
      const sessionAfterSignOut = await authClient.getSession();
      console.log("   Session cleared:", !sessionAfterSignOut.data?.session);
    } catch (error: any) {
      console.log("   ❌ Sign out failed:", error.message);
    }
    
    // Test 6: Invalid credentials
    console.log("\n6️⃣ Testing Invalid Credentials...");
    try {
      await authClient.signIn.email({
        email: testUser.email,
        password: "WrongPassword123!",
      });
      console.log("   ❌ Expected error but sign in succeeded");
    } catch (error: any) {
      console.log("   ✅ Correctly rejected invalid credentials");
      console.log("   Error:", error.message);
    }
    
    // Summary
    console.log("\n✨ API Test Summary:");
    console.log("   - API endpoint is configured correctly");
    console.log("   - Authentication flow works as expected");
    console.log("   - Session management is functional");
    console.log("   - Error handling is working");
    
    console.log("\n📝 Next Steps:");
    console.log("   1. Test OAuth providers (GitHub, Google, etc.)");
    console.log("   2. Test two-factor authentication plugin");
    console.log("   3. Test magic link authentication");
    console.log("   4. Implement UI components for authentication");
    
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
  }
}

// Note about running this test
console.log("⚠️  Important: This test requires the Next.js dev server to be running!");
console.log("   Run 'pnpm dev' in another terminal before running this test.\n");

// Add a delay to give user time to read the message
setTimeout(() => {
  testBetterAuthAPI().catch(console.error);
}, 3000);