#!/usr/bin/env tsx
/**
 * Better Auth Detailed Configuration Test Script
 * 
 * Based on official documentation from Context7
 * Documentation: https://better-auth.com
 * 
 * This script performs comprehensive analysis of Better Auth setup:
 * - Environment variable configuration
 * - Auth configuration file analysis
 * - API route verification
 * - Client library setup validation
 * - Database configuration checks
 * - Plugin detection and feature availability
 * 
 * Key patterns from documentation:
 * - Better Auth requires BETTER_AUTH_SECRET and BETTER_AUTH_URL env vars
 * - Configuration is done via betterAuth() function in auth.ts
 * - API routes use catch-all [...all] pattern for Next.js
 * - Client is created with createAuthClient()
 * - Database schema uses 'better_auth' prefix by default
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main test function for Better Auth configuration analysis
 * 
 * Performs the following checks:
 * 1. Environment variables - required and optional
 * 2. Auth configuration - plugins, providers, and features
 * 3. API route setup - Next.js catch-all route
 * 4. Client library - SDK methods availability
 * 5. Database setup - migrations and schema
 */
async function testBetterAuthDetailed() {
  console.log("🔍 Better Auth Detailed Configuration Test\n");

  const results = {
    setup: {
      envVars: false,
      authConfig: false,
      apiRoute: false,
      clientLib: false,
      database: false,
    },
    plugins: {
      admin: false,
      twoFactor: false,
      magicLink: false,
      oauth: false,
    },
    features: {
      emailPassword: false,
      socialProviders: [] as string[],
      sessionManagement: false,
    }
  };

  /**
   * Test 1: Environment Variables
   * 
   * From Better Auth documentation:
   * Required environment variables:
   * - BETTER_AUTH_SECRET: Used for signing tokens and cookies
   * - BETTER_AUTH_URL: Base URL of your application
   * - DATABASE_URL: Connection string for your database
   * 
   * Optional variables for features:
   * - OAuth provider credentials (CLIENT_ID and CLIENT_SECRET)
   * - Email service credentials (e.g., RESEND_API_KEY)
   */
  // Test 1: Environment Variables
  console.log("1️⃣ Environment Variables Check:");
  const envVars = {
    required: {
      'BETTER_AUTH_SECRET': process.env.BETTER_AUTH_SECRET,
      'BETTER_AUTH_URL': process.env.BETTER_AUTH_URL,
      'DATABASE_URL': process.env.DATABASE_URL,
    },
    optional: {
      'GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID,
      'GITHUB_CLIENT_SECRET': process.env.GITHUB_CLIENT_SECRET,
      'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
      'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
      'RESEND_API_KEY': process.env.RESEND_API_KEY,
    }
  };

  let allRequiredPresent = true;
  for (const [key, value] of Object.entries(envVars.required)) {
    if (value) {
      console.log(`   ✅ ${key}: Set`);
    } else {
      console.log(`   ❌ ${key}: Missing`);
      allRequiredPresent = false;
    }
  }

  console.log("\n   Optional (for features):");
  for (const [key, value] of Object.entries(envVars.optional)) {
    if (value) {
      console.log(`   ✅ ${key}: Set`);
    } else {
      console.log(`   ⚠️  ${key}: Not set`);
    }
  }

  results.setup.envVars = allRequiredPresent;

  /**
   * Test 2: Auth Configuration
   * 
   * From Better Auth documentation:
   * The auth configuration is created using betterAuth() function
   * Configuration includes:
   * - Database adapter configuration
   * - Email/password authentication settings
   * - OAuth provider configuration
   * - Plugin registration (admin, twoFactor, magicLink, etc.)
   * - Session management settings
   * - Security settings (e.g., trustedOrigins)
   */
  // Test 2: Auth Configuration
  console.log("\n2️⃣ Auth Configuration Analysis:");
  const authConfigPath = path.join(process.cwd(), "src/lib/auth.ts");
  const altAuthConfigPath = path.join(process.cwd(), "lib/auth.ts");
  
  let authContent = '';
  try {
    try {
      authContent = await fs.readFile(authConfigPath, 'utf-8');
      console.log(`   ✅ Auth config found at: src/lib/auth.ts`);
    } catch {
      authContent = await fs.readFile(altAuthConfigPath, 'utf-8');
      console.log(`   ✅ Auth config found at: lib/auth.ts`);
    }
    results.setup.authConfig = true;

    // Analyze configuration
    console.log("\n   Configuration Details:");
    
    /**
     * Check for email/password authentication
     * From documentation: emailAndPassword: { enabled: true }
     */
    // Check for email/password
    if (authContent.includes('emailAndPassword')) {
      console.log("   ✅ Email/Password authentication enabled");
      results.features.emailPassword = true;
    }

    /**
     * Check for Better Auth plugins
     * From documentation: Plugins extend auth functionality
     * Common plugins:
     * - admin: User management capabilities
     * - twoFactor: Two-factor authentication support
     * - magicLink: Passwordless email authentication
     */
    // Check for plugins
    if (authContent.includes('admin(')) {
      console.log("   ✅ Admin plugin configured");
      results.plugins.admin = true;
    }
    
    if (authContent.includes('twoFactor(')) {
      console.log("   ✅ Two-factor authentication configured");
      results.plugins.twoFactor = true;
    }
    
    if (authContent.includes('magicLink(')) {
      console.log("   ✅ Magic link authentication configured");
      results.plugins.magicLink = true;
    }

    /**
     * Check for OAuth providers
     * From documentation: socialProviders configuration
     * Each provider requires:
     * - clientId: OAuth app client ID
     * - clientSecret: OAuth app client secret
     * - redirectURI: Optional custom redirect URI
     */
    // Check for OAuth providers
    if (authContent.includes('socialProviders')) {
      console.log("   ✅ Social providers configured");
      results.plugins.oauth = true;
      
      if (authContent.includes('github:')) {
        console.log("      ✅ GitHub OAuth");
        results.features.socialProviders.push('github');
      }
      if (authContent.includes('google:')) {
        console.log("      ✅ Google OAuth");
        results.features.socialProviders.push('google');
      }
    }

    /**
     * Check session configuration
     * From documentation: Session settings include:
     * - expiresIn: Session duration
     * - updateAge: When to refresh session
     * - cookieCache: Performance optimization
     */
    // Check session configuration
    if (authContent.includes('session')) {
      console.log("   ✅ Session management configured");
      results.features.sessionManagement = true;
    }

  } catch (error) {
    console.log("   ❌ Auth configuration not found");
  }

  /**
   * Test 3: API Route
   * 
   * From Better Auth documentation:
   * Next.js App Router requires a catch-all route [...all]
   * The route should export:
   * - GET handler for auth.handler
   * - POST handler for auth.handler
   * This single route handles all auth endpoints automatically
   */
  // Test 3: API Route
  console.log("\n3️⃣ API Route Setup:");
  const apiRoutePath = path.join(process.cwd(), "src/app/api/auth/[...all]/route.ts");
  const altApiRoutePath = path.join(process.cwd(), "app/api/auth/[...all]/route.ts");
  
  try {
    try {
      await fs.access(apiRoutePath);
      console.log("   ✅ API route found at: src/app/api/auth/[...all]/route.ts");
    } catch {
      await fs.access(altApiRoutePath);
      console.log("   ✅ API route found at: app/api/auth/[...all]/route.ts");
    }
    results.setup.apiRoute = true;
    
    console.log("   ℹ️  Route handles all auth endpoints via Better Auth");
    console.log("   ℹ️  Use SDK methods instead of direct API calls");
    
  } catch (error) {
    console.log("   ❌ API route not found");
    console.log("   📝 Create it at: src/app/api/auth/[...all]/route.ts");
  }

  /**
   * Test 4: Client Library
   * 
   * From Better Auth documentation:
   * Client setup uses createAuthClient() from better-auth/client
   * or better-auth/react for React applications
   * 
   * The client provides all authentication methods:
   * - signIn: Various sign-in methods
   * - signUp: User registration
   * - signOut: End session
   * - getSession: Retrieve current session
   * - Additional methods from plugins
   */
  // Test 4: Client Library
  console.log("\n4️⃣ Client Library Setup:");
  const clientPath = path.join(process.cwd(), "src/lib/auth-client.ts");
  const altClientPath = path.join(process.cwd(), "lib/auth-client.ts");
  
  try {
    let clientContent = '';
    try {
      clientContent = await fs.readFile(clientPath, 'utf-8');
      console.log("   ✅ Client library found at: src/lib/auth-client.ts");
    } catch {
      clientContent = await fs.readFile(altClientPath, 'utf-8');
      console.log("   ✅ Client library found at: lib/auth-client.ts");
    }
    results.setup.clientLib = true;
    
    if (clientContent.includes('createAuthClient')) {
      console.log("   ✅ createAuthClient is exported");
    }
    
    /**
     * List available SDK methods based on configuration
     * From documentation: All methods return { data, error }
     */
    console.log("\n   Available client methods:");
    console.log("   - authClient.signIn.email()");
    console.log("   - authClient.signUp.email()");
    console.log("   - authClient.signOut()");
    console.log("   - authClient.getSession()");
    
    if (results.plugins.oauth) {
      console.log("   - authClient.signIn.social()");
    }
    if (results.plugins.magicLink) {
      console.log("   - authClient.signIn.magicLink()");
    }
    if (results.plugins.twoFactor) {
      console.log("   - authClient.twoFactor.*");
    }
    if (results.plugins.admin) {
      console.log("   - authClient.admin.*");
    }
    
  } catch (error) {
    console.log("   ❌ Client library not found");
  }

  /**
   * Test 5: Database Configuration
   * 
   * From Better Auth documentation:
   * - Better Auth uses a database adapter (e.g., drizzle)
   * - Tables use 'better_auth' prefix by default
   * - Migrations can be auto-generated or manual
   * - Required tables: user, session, account, verification
   * - Optional tables based on plugins (e.g., twoFactor)
   */
  // Test 5: Database
  console.log("\n5️⃣ Database Configuration:");
  if (process.env.DATABASE_URL) {
    console.log("   ✅ DATABASE_URL is configured");
    results.setup.database = true;
    
    // Check for migrations
    const migrationsPath = path.join(process.cwd(), "better-auth_migrations");
    try {
      const migrations = await fs.readdir(migrationsPath);
      console.log(`   ✅ Found ${migrations.length} migration file(s)`);
    } catch {
      console.log("   ⚠️  No migrations directory found");
    }
  } else {
    console.log("   ❌ DATABASE_URL not configured");
  }

  // Summary Report
  console.log("\n📊 Configuration Summary:");
  console.log("=".repeat(50));
  
  const setupComplete = Object.values(results.setup).every(v => v === true);
  const setupCount = Object.values(results.setup).filter(v => v === true).length;
  
  console.log(`\n✅ Core Setup: ${setupCount}/5 components`);
  for (const [key, value] of Object.entries(results.setup)) {
    console.log(`   ${value ? '✅' : '❌'} ${key}`);
  }
  
  console.log(`\n🔌 Plugins Configured:`);
  for (const [key, value] of Object.entries(results.plugins)) {
    console.log(`   ${value ? '✅' : '⚠️'} ${key}`);
  }
  
  console.log(`\n🎯 Features Available:`);
  console.log(`   ${results.features.emailPassword ? '✅' : '❌'} Email/Password Auth`);
  console.log(`   ${results.features.socialProviders.length > 0 ? '✅' : '⚠️'} Social Auth: ${results.features.socialProviders.join(', ') || 'None'}`);
  console.log(`   ${results.features.sessionManagement ? '✅' : '❌'} Session Management`);

  // Recommendations
  console.log("\n💡 Recommendations:");
  if (!setupComplete) {
    console.log("   - Complete missing core setup components");
  }
  if (results.features.socialProviders.length === 0 && (envVars.optional.GITHUB_CLIENT_ID || envVars.optional.GOOGLE_CLIENT_ID)) {
    console.log("   - Configure social providers in auth.ts");
  }
  if (!results.plugins.admin) {
    console.log("   - Consider adding admin plugin for user management");
  }
  if (!results.plugins.twoFactor) {
    console.log("   - Consider adding 2FA for enhanced security");
  }

  /**
   * Usage Examples
   * From Better Auth documentation - proper SDK usage patterns
   */
  // Usage Examples
  console.log("\n📚 SDK Usage Examples:");
  console.log("   // Client-side authentication");
  console.log("   await authClient.signIn.email({ email, password })");
  console.log("   await authClient.signUp.email({ email, password, name })");
  console.log("   await authClient.signOut()");
  console.log("   const session = await authClient.getSession()");
  
  if (results.plugins.oauth) {
    console.log("\n   // Social authentication");
    console.log("   await authClient.signIn.social({ provider: 'github' })");
  }
  
  if (results.plugins.admin) {
    console.log("\n   // Admin operations");
    console.log("   await authClient.admin.listUsers({ query: { limit: 10 } })");
    console.log("   await authClient.admin.createUser({ email, password, role })");
  }

  /**
   * Important: Always use SDK methods
   * From documentation: Direct API calls bypass important
   * security features like CSRF protection and proper
   * session handling. Always use the SDK methods.
   */
  console.log("\n❌ Never use:");
  console.log("   fetch('/api/auth/...')  // Use SDK instead!");

  return results;
}

/**
 * Important notes from Better Auth documentation:
 * 
 * 1. Configuration best practices:
 *    - Store sensitive values in environment variables
 *    - Use strong BETTER_AUTH_SECRET (min 32 characters)
 *    - Configure trustedOrigins for production
 * 
 * 2. Security considerations:
 *    - Enable secure cookies in production
 *    - Use HTTPS for all auth operations
 *    - Implement rate limiting for auth endpoints
 * 
 * 3. Database management:
 *    - Run migrations before starting the app
 *    - Use the built-in migration system when possible
 *    - Monitor database performance for session queries
 */
// Note about SDK usage
console.log(chalk.cyan("ℹ️  This test analyzes Better Auth configuration."));
console.log(chalk.cyan("   Remember: Always use SDK methods, never direct fetch calls.\n"));

// Run the detailed test
testBetterAuthDetailed()
  .then((results) => {
    const setupComplete = Object.values(results.setup).every(v => v === true);
    console.log(setupComplete ? "\n✅ Better Auth is properly configured!" : "\n⚠️  Some configuration needed");
    process.exit(setupComplete ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error);
    process.exit(1);
  });