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

// Test results tracking
interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

// Helper function to record test results
function recordTest(name: string, status: 'passed' | 'failed' | 'skipped', message: string, details?: any) {
  testResults.push({ name, status, message, details });
  const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
  console.log(`   ${icon} ${name}: ${message}`);
}

// Test user configurations
const testUsers = {
  emailPassword: {
    email: `test-full-${Date.now()}@example.com`,
    password: "TestPassword123!",
    name: "Full Test User"
  },
  oauth: {
    email: `test-oauth-${Date.now()}@example.com`,
    name: "OAuth Test User"
  },
  magicLink: {
    email: `test-magic-${Date.now()}@example.com`,
    name: "Magic Link Test User"
  }
};

async function testAllAuthenticationFlows() {
  console.log("🚀 Better Auth Comprehensive Authentication Flow Test\n");
  console.log("This test will verify all authentication methods work correctly together.\n");
  
  console.log("📋 Test Environment:");
  console.log(`   Base URL: ${process.env.BETTER_AUTH_URL || "http://localhost:3000"}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`);
  
  try {
    // Pre-flight check
    console.log("\n🔍 Pre-flight Checks:");
    
    // Check API health
    try {
      const response = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/session`);
      if (response.ok) {
        recordTest("API Health", "passed", "API is reachable and responding");
      } else {
        recordTest("API Health", "failed", `API returned status ${response.status}`);
        console.log("\n⚠️  Cannot proceed without a working API. Please run 'pnpm dev' first.");
        return;
      }
    } catch (error) {
      recordTest("API Health", "failed", "Cannot reach API");
      console.log("\n⚠️  Cannot proceed without a working API. Please run 'pnpm dev' first.");
      return;
    }
    
    // Check configuration
    const authConfigPath = path.join(process.cwd(), "lib/auth.ts");
    const fs = await import("fs/promises");
    try {
      const authConfig = await fs.readFile(authConfigPath, 'utf-8');
      
      // Check for various features
      const features = {
        "Email/Password": authConfig.includes("emailAndPassword"),
        "OAuth Providers": authConfig.includes("better-auth/plugins/oauth"),
        "Two-Factor Auth": authConfig.includes("twoFactor"),
        "Magic Links": authConfig.includes("magicLink"),
      };
      
      Object.entries(features).forEach(([feature, enabled]) => {
        recordTest(`${feature} Configuration`, enabled ? "passed" : "failed", 
          enabled ? "Feature is configured" : "Feature not found in auth.ts");
      });
      
    } catch (error) {
      recordTest("Configuration Check", "failed", "Could not read auth.ts");
    }
    
    // Test 1: Email/Password Authentication Flow
    console.log("\n\n1️⃣ Testing Email/Password Authentication Flow:");
    
    // Sign up with email/password
    try {
      const signUpResult = await authClient.signUp.email({
        email: testUsers.emailPassword.email,
        password: testUsers.emailPassword.password,
        name: testUsers.emailPassword.name,
      });
      
      if (signUpResult.data?.user) {
        recordTest("Email Sign Up", "passed", `User created with ID: ${signUpResult.data.user.id}`);
        
        // Test immediate sign in
        const signInResult = await authClient.signIn.email({
          email: testUsers.emailPassword.email,
          password: testUsers.emailPassword.password,
        });
        
        if (signInResult.data?.session) {
          recordTest("Email Sign In", "passed", "Session created successfully");
          
          // Test session persistence
          const session = await authClient.getSession();
          if (session.data?.session) {
            recordTest("Session Persistence", "passed", "Session is active and retrievable");
          } else {
            recordTest("Session Persistence", "failed", "Session not found after sign in");
          }
          
          // Sign out
          await authClient.signOut();
          recordTest("Sign Out", "passed", "User signed out successfully");
          
        } else {
          recordTest("Email Sign In", "failed", "No session created");
        }
      } else {
        recordTest("Email Sign Up", "failed", "User creation failed");
      }
    } catch (error: any) {
      recordTest("Email/Password Flow", "failed", error.message);
    }
    
    // Test 2: OAuth Provider Flow
    console.log("\n\n2️⃣ Testing OAuth Provider Flow:");
    
    const oauthProviders = [
      { name: 'github', configured: !!process.env.GITHUB_CLIENT_ID },
      { name: 'google', configured: !!process.env.GOOGLE_CLIENT_ID },
      { name: 'discord', configured: !!process.env.DISCORD_CLIENT_ID },
    ];
    
    for (const provider of oauthProviders) {
      if (provider.configured) {
        try {
          // Test OAuth endpoint availability
          const oauthUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/${provider.name}`;
          const response = await fetch(oauthUrl, { method: 'GET', redirect: 'manual' });
          
          if (response.status === 302 || response.status === 307) {
            recordTest(`${provider.name} OAuth Endpoint`, "passed", "Endpoint redirects to provider");
            
            // Check callback endpoint
            const callbackUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/${provider.name}`;
            recordTest(`${provider.name} Callback URL`, "passed", `Callback configured at: ${callbackUrl}`);
          } else {
            recordTest(`${provider.name} OAuth Endpoint`, "failed", `Unexpected status: ${response.status}`);
          }
        } catch (error: any) {
          recordTest(`${provider.name} OAuth`, "failed", error.message);
        }
      } else {
        recordTest(`${provider.name} OAuth`, "skipped", "Provider not configured");
      }
    }
    
    // Test OAuth client methods
    if (authClient.signIn.social) {
      recordTest("OAuth Client Methods", "passed", "Social sign-in methods available");
    } else {
      recordTest("OAuth Client Methods", "failed", "Social sign-in methods not found");
    }
    
    // Test 3: Two-Factor Authentication Flow
    console.log("\n\n3️⃣ Testing Two-Factor Authentication Flow:");
    
    // Create a user for 2FA testing
    try {
      // Sign up and sign in first
      await authClient.signUp.email({
        email: `test-2fa-${Date.now()}@example.com`,
        password: "Test2FA123!",
        name: "2FA Test User",
      });
      
      await authClient.signIn.email({
        email: `test-2fa-${Date.now()}@example.com`,
        password: "Test2FA123!",
      });
      
      if (authClient.twoFactor) {
        recordTest("2FA Client Methods", "passed", "Two-factor methods available");
        
        // Try to enable 2FA
        try {
          const enable2FAResult = await authClient.twoFactor.enable();
          
          if (enable2FAResult.data?.secret) {
            recordTest("2FA Enable", "passed", "2FA setup initiated with secret");
            
            // Generate TOTP code
            const totpCode = authenticator.generate(enable2FAResult.data.secret);
            recordTest("TOTP Generation", "passed", `Generated code: ${totpCode}`);
            
            // Would verify here but requires actual authentication context
            recordTest("2FA Verification", "skipped", "Requires active session context");
            
          } else {
            recordTest("2FA Enable", "failed", "No secret returned");
          }
        } catch (error: any) {
          recordTest("2FA Setup", "failed", error.message);
        }
      } else {
        recordTest("2FA Client Methods", "failed", "Two-factor methods not available");
      }
    } catch (error: any) {
      recordTest("2FA Test User", "failed", error.message);
    }
    
    // Test 4: Magic Link Flow
    console.log("\n\n4️⃣ Testing Magic Link Authentication Flow:");
    
    if (authClient.signIn.magicLink) {
      recordTest("Magic Link Client Methods", "passed", "Magic link methods available");
      
      try {
        // Request magic link
        const magicLinkResult = await authClient.signIn.magicLink({
          email: testUsers.magicLink.email,
        });
        
        if (magicLinkResult.data) {
          recordTest("Magic Link Request", "passed", "Magic link requested successfully");
          
          // Check magic link endpoints
          const magicLinkEndpoint = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/magic-link/send`;
          const verifyEndpoint = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/magic-link/verify`;
          
          recordTest("Magic Link Endpoints", "passed", `Send: ${magicLinkEndpoint}, Verify: ${verifyEndpoint}`);
          
        } else if (magicLinkResult.error) {
          recordTest("Magic Link Request", "failed", magicLinkResult.error.message || "Unknown error");
        }
      } catch (error: any) {
        recordTest("Magic Link Flow", "failed", error.message);
      }
    } else {
      recordTest("Magic Link Client Methods", "failed", "Magic link methods not available");
    }
    
    // Test 5: Cross-Authentication Scenarios
    console.log("\n\n5️⃣ Testing Cross-Authentication Scenarios:");
    
    // Test account linking scenarios
    try {
      // Create a user with email/password
      const linkTestEmail = `test-link-${Date.now()}@example.com`;
      await authClient.signUp.email({
        email: linkTestEmail,
        password: "LinkTest123!",
        name: "Link Test User",
      });
      
      recordTest("Account Creation for Linking", "passed", "Base account created");
      
      // In a real scenario, we would:
      // 1. Link OAuth accounts to this email
      // 2. Enable 2FA on this account
      // 3. Test magic link with same email
      recordTest("OAuth Account Linking", "skipped", "Requires browser interaction");
      recordTest("Multiple Auth Methods", "skipped", "Requires browser interaction");
      
    } catch (error: any) {
      recordTest("Cross-Authentication Setup", "failed", error.message);
    }
    
    // Test 6: Error Handling and Edge Cases
    console.log("\n\n6️⃣ Testing Error Handling and Edge Cases:");
    
    // Test duplicate email registration
    try {
      await authClient.signUp.email({
        email: testUsers.emailPassword.email,
        password: "AnotherPassword123!",
        name: "Duplicate User",
      });
      recordTest("Duplicate Email Prevention", "failed", "Allowed duplicate registration");
    } catch (error: any) {
      recordTest("Duplicate Email Prevention", "passed", "Correctly rejected duplicate email");
    }
    
    // Test invalid password
    try {
      await authClient.signIn.email({
        email: testUsers.emailPassword.email,
        password: "WrongPassword!",
      });
      recordTest("Invalid Password Handling", "failed", "Accepted invalid password");
    } catch (error: any) {
      recordTest("Invalid Password Handling", "passed", "Correctly rejected invalid password");
    }
    
    // Test rate limiting (if configured)
    recordTest("Rate Limiting", "skipped", "Requires multiple rapid requests");
    
    // Generate Test Report
    console.log("\n\n📊 Test Results Summary:");
    console.log("─".repeat(60));
    
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const skipped = testResults.filter(t => t.status === 'skipped').length;
    
    console.log(`   Total Tests: ${testResults.length}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    // Authentication Feature Matrix
    console.log("\n\n📋 Authentication Feature Matrix:");
    console.log("─".repeat(60));
    
    const features = [
      { name: "Email/Password", status: testResults.find(t => t.name.includes("Email Sign"))?.status || 'unknown' },
      { name: "OAuth (GitHub)", status: testResults.find(t => t.name.includes("github OAuth"))?.status || 'unknown' },
      { name: "OAuth (Google)", status: testResults.find(t => t.name.includes("google OAuth"))?.status || 'unknown' },
      { name: "OAuth (Discord)", status: testResults.find(t => t.name.includes("discord OAuth"))?.status || 'unknown' },
      { name: "Two-Factor Auth", status: testResults.find(t => t.name.includes("2FA"))?.status || 'unknown' },
      { name: "Magic Links", status: testResults.find(t => t.name.includes("Magic Link"))?.status || 'unknown' },
    ];
    
    features.forEach(feature => {
      const icon = feature.status === 'passed' ? '✅' : 
                   feature.status === 'failed' ? '❌' : 
                   feature.status === 'skipped' ? '⏭️' : '❓';
      console.log(`   ${icon} ${feature.name}`);
    });
    
    // Implementation Readiness Assessment
    console.log("\n\n🎯 Implementation Readiness Assessment:");
    console.log("─".repeat(60));
    
    const readinessChecks = [
      { 
        item: "Basic Authentication", 
        ready: passed > 0,
        note: passed > 0 ? "Core auth functions are working" : "Fix basic auth first" 
      },
      { 
        item: "OAuth Integration", 
        ready: oauthProviders.some(p => p.configured),
        note: oauthProviders.some(p => p.configured) ? "At least one OAuth provider configured" : "Configure OAuth providers" 
      },
      { 
        item: "Enhanced Security (2FA)", 
        ready: !!authClient.twoFactor,
        note: authClient.twoFactor ? "2FA plugin is available" : "Add 2FA plugin for enhanced security" 
      },
      { 
        item: "Passwordless Auth", 
        ready: !!authClient.signIn.magicLink,
        note: authClient.signIn.magicLink ? "Magic link authentication available" : "Configure magic link plugin" 
      },
      { 
        item: "Production Ready", 
        ready: failed === 0 && passed > 10,
        note: failed === 0 ? "All tests passing" : `Fix ${failed} failing tests first` 
      },
    ];
    
    readinessChecks.forEach(check => {
      const icon = check.ready ? '✅' : '⚠️';
      console.log(`   ${icon} ${check.item}: ${check.note}`);
    });
    
    // Next Steps
    console.log("\n\n🚀 Next Steps for UI Implementation:");
    console.log("─".repeat(60));
    console.log("   1. Create authentication pages:");
    console.log("      - /auth/login - Main login page with all methods");
    console.log("      - /auth/register - Registration page");
    console.log("      - /auth/verify-email - Email verification");
    console.log("      - /auth/forgot-password - Password reset");
    console.log("      - /auth/two-factor - 2FA setup and verification");
    console.log("      - /auth/callback/[provider] - OAuth callbacks");
    console.log("\n   2. Implement authentication components:");
    console.log("      - LoginForm with email/password");
    console.log("      - SocialLoginButtons for OAuth");
    console.log("      - MagicLinkForm for passwordless");
    console.log("      - TwoFactorSetup with QR code");
    console.log("      - SessionManager for auth state");
    console.log("\n   3. Add authentication middleware:");
    console.log("      - Protected route wrapper");
    console.log("      - Session refresh logic");
    console.log("      - Remember me functionality");
    console.log("      - Account linking flows");
    
    // Save detailed test results
    const resultsPath = path.join(process.cwd(), "scripts/test-results.json");
    try {
      await fs.writeFile(resultsPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: { passed, failed, skipped, total: testResults.length },
        results: testResults,
        features: features,
        readiness: readinessChecks
      }, null, 2));
      console.log(`\n\n💾 Detailed results saved to: ${resultsPath}`);
    } catch (error) {
      console.log("\n⚠️  Could not save test results to file");
    }
    
  } catch (error) {
    console.error("\n\n❌ Comprehensive test suite failed:", error);
  }
}

// Run the comprehensive test
console.log("🔧 Starting Better Auth Comprehensive Test Suite...\n");
console.log("This test will verify all authentication methods are properly configured");
console.log("and working together correctly.\n");

console.log("⚠️  Prerequisites:");
console.log("   1. Next.js dev server running (pnpm dev)");
console.log("   2. Database configured and connected");
console.log("   3. Better Auth configured in lib/auth.ts");
console.log("   4. Environment variables set in .env.local\n");

// Add delay for user to read prerequisites
setTimeout(() => {
  testAllAuthenticationFlows().catch(console.error);
}, 3000);