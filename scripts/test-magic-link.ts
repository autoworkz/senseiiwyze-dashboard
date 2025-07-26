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

// Test user for magic link
const testUser = {
  email: `test-magic-${Date.now()}@example.com`,
  name: "Test Magic Link User"
};

// Mock email storage for testing
const sentEmails: { to: string; subject: string; url: string; timestamp: Date }[] = [];

async function testMagicLinkPlugin() {
  console.log("🔮 Better Auth Magic Link Authentication Test Suite\n");
  
  console.log("📋 Test Configuration:");
  console.log(`   Base URL: ${process.env.BETTER_AUTH_URL || "http://localhost:3000"}`);
  console.log(`   Test Email: ${testUser.email}`);
  console.log(`   Email Service: Mock (for testing)`);
  
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
    
    // Test 2: Check if Magic Link plugin is configured
    console.log("\n2️⃣ Checking Magic Link Plugin Configuration...");
    try {
      const authConfigPath = path.join(process.cwd(), "lib/auth.ts");
      const fs = await import("fs/promises");
      const authConfig = await fs.readFile(authConfigPath, 'utf-8');
      
      const hasMagicLinkImport = authConfig.includes("better-auth/plugins/magic-link") || 
                                 authConfig.includes("magicLink");
      const hasMagicLinkPlugin = authConfig.includes("magicLink(");
      const hasSendMagicLink = authConfig.includes("sendMagicLink");
      
      console.log("   Magic Link import:", hasMagicLinkImport ? "✅" : "❌");
      console.log("   Magic Link plugin configured:", hasMagicLinkPlugin ? "✅" : "❌");
      console.log("   sendMagicLink handler:", hasSendMagicLink ? "✅" : "❌");
      
      if (!hasMagicLinkImport || !hasMagicLinkPlugin) {
        console.log("\n⚠️  Magic Link authentication plugin not configured!");
        console.log("   Add this to your lib/auth.ts:");
        console.log(`
import { magicLink } from "better-auth/plugins/magic-link";

export const auth = betterAuth({
  // ... existing config
  
  plugins: [
    magicLink({
      sendMagicLink: async (email, url, user) => {
        // Send email using your email service
        await sendEmail({
          to: email,
          subject: "Your Magic Link",
          html: \`<a href="\${url}">Click here to sign in</a>\`,
        });
      },
      // Optional: customize link expiration
      expiresIn: 60 * 15, // 15 minutes
    }),
  ],
});`);
        return;
      }
      
      console.log("   ✅ Magic Link plugin appears to be configured");
      
    } catch (error: any) {
      console.log("   ❌ Failed to check Better Auth configuration:", error.message);
    }
    
    // Test 3: Check client-side magic link methods
    console.log("\n3️⃣ Testing Client-side Magic Link Methods...");
    
    if (!authClient.signIn.magicLink) {
      console.log("   ❌ Magic link sign-in method not available");
      console.log("   Ensure the magic link plugin is properly configured");
      return;
    }
    
    console.log("   ✅ Magic link sign-in method is available");
    
    // Test 4: Request Magic Link
    console.log("\n4️⃣ Testing Magic Link Request...");
    
    try {
      console.log("   🔄 Requesting magic link for:", testUser.email);
      
      // Request magic link
      const magicLinkResult = await authClient.signIn.magicLink({
        email: testUser.email,
      });
      
      if (magicLinkResult.data) {
        console.log("   ✅ Magic link request successful");
        console.log("   Response:", magicLinkResult.data);
        
        // Check if the API indicates email was sent
        if (magicLinkResult.data.success || magicLinkResult.data.message) {
          console.log("   📧 Email status:", magicLinkResult.data.message || "Sent");
        }
      } else if (magicLinkResult.error) {
        console.log("   ❌ Magic link request failed:", magicLinkResult.error);
      }
      
    } catch (error: any) {
      console.log("   ❌ Magic link request error:", error.message);
      console.log("   This might be expected if email service is not configured");
    }
    
    // Test 5: Check Magic Link API endpoints
    console.log("\n5️⃣ Testing Magic Link API Endpoints...");
    
    try {
      // Test magic link request endpoint
      const magicLinkEndpoint = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/magic-link/send`;
      console.log(`   📍 Magic Link Send Endpoint: ${magicLinkEndpoint}`);
      
      const magicLinkResponse = await fetch(magicLinkEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
        }),
      });
      
      console.log(`   Response Status: ${magicLinkResponse.status}`);
      
      if (magicLinkResponse.ok) {
        const data = await magicLinkResponse.json();
        console.log("   ✅ Magic link endpoint is working");
        console.log("   Response data:", JSON.stringify(data, null, 2));
      } else {
        console.log("   ⚠️ Magic link endpoint returned:", magicLinkResponse.status);
      }
      
      // Test magic link verification endpoint structure
      const verifyEndpoint = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/magic-link/verify`;
      console.log(`\n   📍 Magic Link Verify Endpoint: ${verifyEndpoint}`);
      console.log("   This endpoint would be called when user clicks the link");
      
    } catch (error: any) {
      console.log("   ❌ Magic link endpoint test failed:", error.message);
    }
    
    // Test 6: Magic Link Flow Explanation
    console.log("\n6️⃣ Magic Link Authentication Flow:");
    console.log("   1. User enters email address");
    console.log("   2. System generates unique token");
    console.log("   3. Token is stored with expiration time");
    console.log("   4. Email sent with magic link containing token");
    console.log("   5. User clicks link in email");
    console.log("   6. System verifies token and creates session");
    console.log("   7. User is signed in automatically");
    
    // Summary
    console.log("\n✨ Magic Link Test Summary:");
    console.log("   - Magic link plugin configuration checked");
    console.log("   - Client-side methods availability verified");
    console.log("   - Magic link request flow tested");
    console.log("   - API endpoints identified");
    console.log("   - Authentication flow documented");
    
    console.log("\n📝 Magic Link Implementation Checklist:");
    console.log("   [ ] Configure email service (SendGrid, Resend, etc.)");
    console.log("   [ ] Install magic link plugin in lib/auth.ts");
    console.log("   [ ] Implement sendMagicLink function");
    console.log("   [ ] Create UI for email input");
    console.log("   [ ] Create 'check your email' confirmation page");
    console.log("   [ ] Handle magic link verification");
    console.log("   [ ] Implement error handling for expired links");
    console.log("   [ ] Add rate limiting for requests");
    
    console.log("\n📧 Email Service Options:");
    console.log("   - Resend (resend.com) - Modern, developer-friendly");
    console.log("   - SendGrid - Enterprise-grade, reliable");
    console.log("   - Postmark - Transactional email focused");
    console.log("   - AWS SES - Cost-effective at scale");
    console.log("   - Mailgun - Good deliverability");
    
    console.log("\n🔧 Example Email Service Integration:");
    console.log(`
// Using Resend as an example
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

magicLink({
  sendMagicLink: async (email, url, user) => {
    await resend.emails.send({
      from: 'Your App <noreply@yourapp.com>',
      to: email,
      subject: 'Sign in to Your App',
      html: \`
        <h2>Sign in to Your App</h2>
        <p>Click the link below to sign in:</p>
        <a href="\${url}" style="...">Sign In</a>
        <p>This link expires in 15 minutes.</p>
      \`,
    });
  },
  expiresIn: 60 * 15, // 15 minutes
})`);
    
    console.log("\n🎨 UI Implementation Example:");
    console.log(`
// Magic Link Sign In Component
export function MagicLinkSignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authClient.signIn.magicLink({ email });
      setIsSent(true);
    } catch (error) {
      console.error('Failed to send magic link:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSent) {
    return (
      <div>
        <h2>Check your email!</h2>
        <p>We sent a sign-in link to {email}</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}`);
    
    console.log("\n🔒 Security Considerations:");
    console.log("   - Use secure random tokens (Better Auth handles this)");
    console.log("   - Set appropriate expiration times (15-30 minutes)");
    console.log("   - Implement rate limiting per email");
    console.log("   - Log authentication attempts");
    console.log("   - Consider IP-based restrictions");
    console.log("   - Use HTTPS for all links");
    console.log("   - Invalidate tokens after use");
    
  } catch (error) {
    console.error("\n❌ Magic link test suite failed:", error);
  }
}

// Note about running this test
console.log("⚠️  Important: Magic Link testing requires:");
console.log("   1. Next.js dev server running (pnpm dev)");
console.log("   2. Magic Link plugin configured in lib/auth.ts");
console.log("   3. Email service configured (or mock for testing)");
console.log("   4. Better Auth tables set up in database\n");

// Add a delay to give user time to read the message
setTimeout(() => {
  testMagicLinkPlugin().catch(console.error);
}, 3000);