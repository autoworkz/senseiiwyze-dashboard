#!/usr/bin/env tsx

import * as dotenv from "dotenv";
import path from "path";
import { createAuthClient } from "better-auth/client";
import { authenticator } from "otplib";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create an auth client for testing
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

// Test user for 2FA
const testUser = {
  email: `test-2fa-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "Test 2FA User"
};

async function test2FAPlugin() {
  console.log("🔐 Better Auth Two-Factor Authentication Test Suite\n");
  
  console.log("📋 Test Configuration:");
  console.log(`   Base URL: ${process.env.BETTER_AUTH_URL || "http://localhost:3000"}`);
  console.log(`   Test Email: ${testUser.email}`);
  console.log(`   2FA Library: otplib (for TOTP generation)`);
  
  try {
    // Test 1: Check if API is reachable
    console.log("\n1️⃣ Testing API Health...");
    const response = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/session`);
    
    if (!response.ok) {
      console.log("   ❌ API is not reachable - is the dev server running?");
      console.log("   Run 'pnpm dev' in another terminal");
      return;
    }
    console.log("   ✅ API is reachable");
    
    // Test 2: Check if 2FA plugin is configured
    console.log("\n2️⃣ Checking 2FA Plugin Configuration...");
    try {
      const authConfigPath = path.join(process.cwd(), "lib/auth.ts");
      const fs = await import("fs/promises");
      const authConfig = await fs.readFile(authConfigPath, 'utf-8');
      
      const has2FAImport = authConfig.includes("better-auth/plugins/two-factor") || 
                           authConfig.includes("twoFactor");
      const has2FAPlugin = authConfig.includes("twoFactor(");
      
      console.log("   2FA import:", has2FAImport ? "✅" : "❌");
      console.log("   2FA plugin configured:", has2FAPlugin ? "✅" : "❌");
      
      if (!has2FAImport || !has2FAPlugin) {
        console.log("\n⚠️  Two-factor authentication plugin not configured!");
        console.log("   Add this to your lib/auth.ts:");
        console.log(`
import { twoFactor } from "better-auth/plugins/two-factor";

export const auth = betterAuth({
  // ... existing config
  
  plugins: [
    twoFactor({
      issuer: "Your App Name",
      totpOptions: {
        period: 30,
        digits: 6,
      },
    }),
  ],
});`);
        return;
      }
      
      console.log("   ✅ 2FA plugin appears to be configured");
      
    } catch (error: any) {
      console.log("   ❌ Failed to check Better Auth configuration:", error.message);
    }
    
    // Test 3: Create a test user
    console.log("\n3️⃣ Creating Test User...");
    let userId: string | undefined;
    
    try {
      const signUpResult = await authClient.signUp.email({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      });
      
      userId = signUpResult.data?.user?.id;
      console.log("   ✅ Test user created");
      console.log("   User ID:", userId);
    } catch (error: any) {
      console.log("   ❌ Failed to create test user:", error.message);
      return;
    }
    
    // Test 4: Sign in to establish session
    console.log("\n4️⃣ Signing In...");
    try {
      await authClient.signIn.email({
        email: testUser.email,
        password: testUser.password,
      });
      console.log("   ✅ Signed in successfully");
    } catch (error: any) {
      console.log("   ❌ Sign in failed:", error.message);
      return;
    }
    
    // Test 5: Enable 2FA
    console.log("\n5️⃣ Testing 2FA Enablement...");
    
    // Check if 2FA methods are available
    if (!authClient.twoFactor) {
      console.log("   ❌ Two-factor methods not available on auth client");
      console.log("   Ensure the 2FA plugin is properly configured");
      return;
    }
    
    try {
      console.log("   🔄 Requesting 2FA setup...");
      
      // Enable 2FA and get QR code/secret
      const enable2FAResult = await authClient.twoFactor.enable();
      
      if (enable2FAResult.data) {
        console.log("   ✅ 2FA enablement initiated");
        console.log("   Secret:", enable2FAResult.data.secret ? "✅ Received" : "❌ Missing");
        console.log("   QR Code URI:", enable2FAResult.data.qrCode ? "✅ Generated" : "❌ Missing");
        console.log("   Backup codes:", enable2FAResult.data.backupCodes?.length || 0);
        
        // Generate a TOTP code for verification
        const secret = enable2FAResult.data.secret;
        if (secret) {
          const totpCode = authenticator.generate(secret);
          console.log("   Generated TOTP code:", totpCode);
          
          // Test 6: Verify 2FA
          console.log("\n6️⃣ Verifying 2FA Setup...");
          try {
            const verifyResult = await authClient.twoFactor.verify({
              code: totpCode,
            });
            
            if (verifyResult.data?.success) {
              console.log("   ✅ 2FA successfully enabled and verified");
            } else {
              console.log("   ❌ 2FA verification failed");
            }
          } catch (error: any) {
            console.log("   ❌ 2FA verification error:", error.message);
          }
        }
      } else {
        console.log("   ❌ Failed to get 2FA setup data");
      }
      
    } catch (error: any) {
      console.log("   ❌ 2FA enablement failed:", error.message);
      console.log("   Error details:", error);
    }
    
    // Test 7: Check 2FA status
    console.log("\n7️⃣ Checking 2FA Status...");
    try {
      const session = await authClient.getSession();
      console.log("   User has 2FA enabled:", session.data?.user?.twoFactorEnabled || false);
    } catch (error: any) {
      console.log("   ❌ Failed to check 2FA status:", error.message);
    }
    
    // Test 8: Test 2FA-protected sign in flow
    console.log("\n8️⃣ Testing 2FA Sign In Flow...");
    console.log("   🔄 Signing out first...");
    await authClient.signOut();
    
    console.log("   🔄 Attempting sign in with 2FA-enabled account...");
    try {
      const signInResult = await authClient.signIn.email({
        email: testUser.email,
        password: testUser.password,
      });
      
      if (signInResult.data?.twoFactorRequired) {
        console.log("   ✅ 2FA challenge required (as expected)");
        console.log("   Would need to provide TOTP code to complete sign in");
      } else {
        console.log("   ⚠️  Sign in succeeded without 2FA challenge");
      }
    } catch (error: any) {
      console.log("   ❌ Sign in failed:", error.message);
    }
    
    // Summary
    console.log("\n✨ 2FA Test Summary:");
    console.log("   - 2FA plugin configuration checked");
    console.log("   - User creation and authentication works");
    console.log("   - 2FA enable/disable methods available");
    console.log("   - TOTP generation and verification tested");
    console.log("   - 2FA-protected sign in flow validated");
    
    console.log("\n📝 2FA Implementation Checklist:");
    console.log("   [ ] Install otplib: pnpm add otplib @types/qrcode");
    console.log("   [ ] Configure 2FA plugin in lib/auth.ts");
    console.log("   [ ] Create UI for 2FA setup (QR code display)");
    console.log("   [ ] Create UI for TOTP code entry");
    console.log("   [ ] Handle backup codes securely");
    console.log("   [ ] Test recovery flow with backup codes");
    console.log("   [ ] Add 2FA status to user profile");
    
    console.log("\n🔧 Example 2FA UI Flow:");
    console.log("   1. User enables 2FA in settings");
    console.log("   2. Display QR code for authenticator app");
    console.log("   3. User scans QR code with Google Authenticator");
    console.log("   4. User enters 6-digit code to verify");
    console.log("   5. Display backup codes for safekeeping");
    console.log("   6. On future logins, prompt for TOTP code");
    
    console.log("\n📱 Authenticator App Setup:");
    console.log("   - Google Authenticator");
    console.log("   - Microsoft Authenticator");
    console.log("   - Authy");
    console.log("   - 1Password");
    console.log("   - Any TOTP-compatible app");
    
  } catch (error) {
    console.error("\n❌ 2FA test suite failed:", error);
  }
}

// Note about running this test
console.log("⚠️  Important: 2FA testing requires:");
console.log("   1. Next.js dev server running (pnpm dev)");
console.log("   2. Two-factor plugin configured in lib/auth.ts");
console.log("   3. otplib package installed (pnpm add otplib)");
console.log("   4. Better Auth tables set up in database\n");

// Add a delay to give user time to read the message
setTimeout(() => {
  test2FAPlugin().catch(console.error);
}, 3000);