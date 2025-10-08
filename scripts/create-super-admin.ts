/**
 * Run with:
 *   pnpm tsx scripts/create-super-admin.ts
 *
 * Creates a super admin user directly in Supabase Postgres.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { auth } from "../src/lib/auth";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must use service role for insert
);

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@senseiwyze.com";
  const name = process.env.SUPER_ADMIN_NAME || "Platform Administrator";

  console.log("🚀 Creating super admin user...");
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Name: ${name}`);

  // 1) Ensure not already created
  console.log("🔍 Checking if user already exists...");
  const { data: existing, error: checkErr } = await supabase
    .from("ba_users")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (checkErr) throw checkErr;
  if (existing && existing.length > 0) {
    console.log(`❌ User with email ${email} already exists. Aborting.`);
    return;
  }

  // 2) Insert into ba_users (no password account yet)
  console.log("👤 Creating user record...");
  const userId = randomUUID();
  const now = new Date().toISOString();
  
  const { data: user, error: userErr } = await supabase
    .from("ba_users")
    .insert([
      {
        id: userId,
        name,
        email,
        email_verified: false, // Will be verified when they click magic link
        created_at: now,
        updated_at: now,
        role: "super-admin", // key part
      },
    ])
    .select()
    .single();

  if (userErr) throw userErr;

  // 3) Send magic link with callback to create password page
  console.log("📧 Sending magic link...");
  try {
    const callbackURL = `/create-password?email=${encodeURIComponent(email)}&organization=Platform Administration`;
    
    const magicLinkResult = await auth.api.signInMagicLink({
      headers: await headers(),
      body: {
        email,
        callbackURL,
        newUserCallbackURL: callbackURL, // works for both new & existing users
      },
    });

    if (magicLinkResult.status) {
      console.log("✅ Magic link sent successfully!");
    } else {
      console.log("⚠️ Magic link may not have been sent:", magicLinkResult);
    }
  } catch (magicLinkError) {
    console.log("⚠️ Error sending magic link:", magicLinkError);
    console.log("   You can manually request a magic link from the login page");
  }

  console.log("✅ Super admin user created successfully!");
  console.log(`   📧 Email: ${email}`);
  console.log(`   🆔 User ID: ${user.id}`);
  console.log(`   🎭 Role: super-admin`);
  console.log("");
  console.log("🎯 Next steps:");
  console.log("   1. Check your email for the magic link");
  console.log("   2. Click the magic link to verify your email");
  console.log("   3. You'll be redirected to create a password");
  console.log("   4. After setting password, you'll have super admin access");
  console.log("");
  console.log("💡 The magic link will automatically redirect to /create-password");
  console.log("   where you can set your secure password!");
}

main().catch((err) => {
  console.error("❌ Error creating super admin:", err);
  process.exit(1);
});
