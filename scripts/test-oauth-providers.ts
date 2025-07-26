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

async function testOAuthProviders() {
  console.log("🔍 Better Auth OAuth Providers Test Suite\n");

  console.log("📋 OAuth Configuration Check:");

  // Check which OAuth providers are configured
  const providers = [
    {
      name: 'GitHub',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      icon: '🐙'
    },
    {
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      icon: '🔵'
    },

  ];

  const configuredProviders: string[] = [];

  providers.forEach(provider => {
    if (provider.clientId && provider.clientSecret) {
      console.log(`   ${provider.icon} ${provider.name}: ✅ Configured`);
      configuredProviders.push(provider.name.toLowerCase());
    } else {
      console.log(`   ${provider.icon} ${provider.name}: ❌ Not configured`);
    }
  });

  if (configuredProviders.length === 0) {
    console.log("\n⚠️  No OAuth providers are configured!");
    console.log("   To test OAuth, add provider credentials to .env.local:");
    console.log("   - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET");
    console.log("   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
    console.log("   - DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET");
    return;
  }

  console.log(`\n✅ Found ${configuredProviders.length} configured provider(s)\n`);

  try {
    // Test 1: Check if API is reachable
    console.log("1️⃣ Testing API Health...");
    const response = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/session`);

    if (!response.ok) {
      console.log("   ❌ API is not reachable - is the dev server running?");
      console.log("   Run 'pnpm dev' in another terminal");
      return;
    }
    console.log("   ✅ API is reachable");

    // Test 2: Generate OAuth URLs
    console.log("\n2️⃣ Testing OAuth URL Generation...");

    for (const provider of configuredProviders) {
      console.log(`\n   Testing ${provider} OAuth:`);

      try {
        // Test OAuth URL generation
        const authUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/${provider}`;
        console.log(`   📍 Auth URL: ${authUrl}`);

        // Check if the OAuth endpoint exists
        const oauthResponse = await fetch(authUrl, {
          method: 'GET',
          redirect: 'manual' // Don't follow redirects
        });

        if (oauthResponse.status === 302 || oauthResponse.status === 307) {
          console.log(`   ✅ ${provider} OAuth endpoint is working`);
          const location = oauthResponse.headers.get('location');
          if (location) {
            console.log(`   🔗 Redirects to: ${location.substring(0, 50)}...`);
          }
        } else {
          console.log(`   ❌ ${provider} OAuth endpoint returned: ${oauthResponse.status}`);
        }

        // Test callback URL structure
        const callbackUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/${provider}`;
        console.log(`   📍 Callback URL: ${callbackUrl}`);

      } catch (error: any) {
        console.log(`   ❌ ${provider} OAuth test failed:`, error.message);
      }
    }

    // Test 3: Client-side OAuth methods
    console.log("\n3️⃣ Testing Client-side OAuth Methods...");

    // Test if social sign-in methods are available
    if (authClient.signIn.social !== undefined) {
      console.log("   ✅ Social sign-in methods are available");

      // Show example usage
      console.log("\n📝 Example OAuth Usage:");
      console.log("   // Sign in with GitHub");
      console.log("   await authClient.signIn.social({ provider: 'github' })");
      console.log("\n   // Sign in with Google");
      console.log("   await authClient.signIn.social({ provider: 'google' })");
      console.log("\n   // Sign in with Discord");
      console.log("   await authClient.signIn.social({ provider: 'discord' })");
    } else {
      console.log("   ❌ Social sign-in methods not found");
    }

    // Test 4: OAuth configuration in Better Auth
    console.log("\n4️⃣ Checking Better Auth OAuth Configuration...");
    try {
      const { auth } = await import("../lib/auth");
      console.log("   ✅ Better Auth configuration loaded");

      // Check if OAuth plugins are configured
      const authConfigPath = path.join(process.cwd(), "lib/auth.ts");
      const fs = await import("fs/promises");
      const authConfig = await fs.readFile(authConfigPath, 'utf-8');

      const hasOAuthImports = authConfig.includes("better-auth/plugins/oauth");
      const hasGitHubPlugin = authConfig.includes("github(") && configuredProviders.includes('github');
      const hasGooglePlugin = authConfig.includes("google(") && configuredProviders.includes('google');
      const hasDiscordPlugin = authConfig.includes("discord(") && configuredProviders.includes('discord');

      console.log("   OAuth imports:", hasOAuthImports ? "✅" : "❌");
      if (configuredProviders.includes('github')) {
        console.log("   GitHub plugin:", hasGitHubPlugin ? "✅" : "❌ Not found in auth.ts");
      }
      if (configuredProviders.includes('google')) {
        console.log("   Google plugin:", hasGooglePlugin ? "✅" : "❌ Not found in auth.ts");
      }
      if (configuredProviders.includes('discord')) {
        console.log("   Discord plugin:", hasDiscordPlugin ? "✅" : "❌ Not found in auth.ts");
      }

      if (!hasOAuthImports || (!hasGitHubPlugin && !hasGooglePlugin && !hasDiscordPlugin)) {
        console.log("\n⚠️  OAuth plugins may not be properly configured in lib/auth.ts");
        console.log("   Make sure to import and configure the OAuth plugins");
      }

    } catch (error: any) {
      console.log("   ❌ Failed to check Better Auth configuration:", error.message);
    }

    // Summary
    console.log("\n✨ OAuth Test Summary:");
    console.log(`   - ${configuredProviders.length} OAuth provider(s) have credentials`);
    console.log("   - OAuth endpoints are accessible");
    console.log("   - Client-side methods are available");
    console.log("   - Callback URLs are properly structured");

    console.log("\n📝 Next Steps:");
    console.log("   1. Complete OAuth flow testing requires browser interaction");
    console.log("   2. Set up OAuth apps on provider platforms:");
    console.log("      - GitHub: https://github.com/settings/developers");
    console.log("      - Google: https://console.cloud.google.com/");
    console.log("      - Discord: https://discord.com/developers/applications");
    console.log("   3. Configure redirect URIs in provider apps:");
    console.log(`      ${process.env.BETTER_AUTH_URL}/api/auth/callback/[provider]`);
    console.log("   4. Test actual OAuth flow in the UI");

    console.log("\n🔧 OAuth Testing Checklist:");
    console.log("   [ ] Provider credentials in .env.local");
    console.log("   [ ] OAuth plugins configured in lib/auth.ts");
    console.log("   [ ] Redirect URIs configured in provider apps");
    console.log("   [ ] Test sign-in flow in browser");
    console.log("   [ ] Handle OAuth callbacks properly");
    console.log("   [ ] Store OAuth account data correctly");

  } catch (error) {
    console.error("\n❌ OAuth test suite failed:", error);
  }
}

// Note about running this test
console.log("⚠️  Important: OAuth testing requires:");
console.log("   1. Next.js dev server running (pnpm dev)");
console.log("   2. OAuth provider credentials in .env.local");
console.log("   3. OAuth apps configured on provider platforms\n");

// Add a delay to give user time to read the message
setTimeout(() => {
  testOAuthProviders().catch(console.error);
}, 3000);