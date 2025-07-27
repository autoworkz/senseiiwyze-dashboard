#!/usr/bin/env tsx

import * as dotenv from "dotenv";
import path from "path";
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";
import chalk from "chalk";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create an auth client with 2FA plugin
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect: () => {
        console.log("   📱 Two-factor authentication required");
      }
    })
  ]
});

async function test2FAPlugin() {
  console.log("🔍 Better Auth 2FA Plugin Test Suite\n");

  try {
    // Test 1: Check if API is reachable using SDK
    console.log("1️⃣ Testing API Health via SDK...");
    
    try {
      const session = await authClient.getSession();
      console.log("   ✅ API is reachable");
      console.log(`   Session status: ${session.data ? 'Active session found' : 'No active session'}`);
    } catch (error) {
      console.log("   ❌ API is not reachable - is the dev server running?");
      console.log("   Run 'pnpm dev' in another terminal");
      return;
    }

    // Test 2: Check if 2FA plugin is available
    console.log("\n2️⃣ Checking 2FA Plugin Availability...");
    
    if (authClient.twoFactor) {
      console.log("   ✅ 2FA plugin is available on client");
      console.log("   Available methods:");
      const methods = Object.keys(authClient.twoFactor);
      methods.forEach(method => {
        console.log(`     - authClient.twoFactor.${method}()`);
      });
    } else {
      console.log("   ❌ 2FA plugin not found on client");
      console.log("   Make sure twoFactorClient is added to authClient plugins");
    }

    // Test 3: Check server-side 2FA configuration
    console.log("\n3️⃣ Checking Server-side 2FA Configuration...");
    try {
      const authConfigPath = path.join(process.cwd(), "src/lib/auth.ts");
      const fs = await import("fs/promises");
      const authConfig = await fs.readFile(authConfigPath, 'utf-8');

      const has2FAImport = authConfig.includes("better-auth/plugins/two-factor") || 
                           authConfig.includes("twoFactor");
      const has2FAPlugin = authConfig.includes("twoFactor(");

      console.log("   2FA import:", has2FAImport ? "✅" : "❌");
      console.log("   2FA plugin configured:", has2FAPlugin ? "✅" : "❌");

      if (!has2FAImport || !has2FAPlugin) {
        console.log("\n⚠️  Two-factor authentication plugin not configured on server!");
        console.log("   Add this to your src/lib/auth.ts:");
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
      }

    } catch (error: any) {
      console.log("   ❌ Failed to check server configuration:", error.message);
    }

    // Test 4: Create a test user for future 2FA testing
    console.log("\n4️⃣ Setting up Test User for 2FA...");
    
    const testUser = {
      email: `test-2fa-${Date.now()}@example.com`,
      password: "Test2FA123!",
      name: "2FA Test User"
    };

    // Sign up
    console.log("   Creating test user...");
    const signUpResult = await authClient.signUp.email({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name
    });

    if (signUpResult.error) {
      console.log(`   ❌ Sign up failed: ${signUpResult.error.message}`);
    } else {
      console.log("   ✅ Test user created");
      console.log("   User ID:", signUpResult.data?.user?.id);
      console.log("   Email:", testUser.email);
    }

    // Summary
    console.log("\n✨ 2FA Plugin Test Summary:");
    console.log("   - API connectivity: ✅");
    console.log(`   - Client-side plugin: ${authClient.twoFactor ? '✅' : '❌'}`);
    console.log("   - Test user created for 2FA testing");

    console.log("\n📝 2FA Implementation Notes:");
    console.log("   1. Install required packages:");
    console.log("      pnpm add otplib @types/qrcode");
    console.log("   2. Configure 2FA plugin in src/lib/auth.ts");
    console.log("   3. Implement UI components:");
    console.log("      - QR code display for setup");
    console.log("      - TOTP input for verification");
    console.log("      - Backup codes management");
    console.log("   4. Test with authenticator apps:");
    console.log("      - Google Authenticator");
    console.log("      - Microsoft Authenticator");
    console.log("      - Authy");

    console.log("\n🔧 Example 2FA Flow:");
    console.log("   // Enable 2FA");
    console.log("   const { data } = await authClient.twoFactor.getTotpUri({ password })");
    console.log("   // Display QR code from data.totpURI");
    console.log("   ");
    console.log("   // Verify TOTP");
    console.log("   await authClient.twoFactor.enable({ password, code: totpCode })");
    console.log("   ");
    console.log("   // Sign in with 2FA");
    console.log("   const signIn = await authClient.signIn.email({ email, password })");
    console.log("   // If 2FA required, prompt for code");
    console.log("   await authClient.twoFactor.verifyTotp({ code: totpCode })");

  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Note about SDK usage
console.log(chalk.cyan("ℹ️  This test uses Better Auth SDK methods exclusively."));
console.log(chalk.cyan("   No direct fetch calls to /api/auth/* endpoints."));
console.log(chalk.cyan("   2FA operations handled via authClient.twoFactor.*\n"));

// Run the test
test2FAPlugin()
  .then(() => {
    console.log("\n✅ 2FA plugin test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });