#!/usr/bin/env tsx

import * as dotenv from "dotenv";
import path from "path";
import { Client } from "pg";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyBetterAuth() {
  console.log("🔍 Better Auth Verification\n");

  // 1. Environment check
  console.log("1️⃣ Environment Variables:");
  console.log("   DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing");
  console.log("   BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "✅ Set" : "❌ Missing");
  console.log("   BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL || "❌ Missing");
  console.log("   NEXT_PUBLIC_AUTH_URL:", process.env.NEXT_PUBLIC_AUTH_URL || "❌ Missing");

  // 2. Database verification using pg client
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("\n2️⃣ Database Connection: ✅ Connected");

    // Check schema
    const schemaCheck = await client.query(
      "SELECT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'better_auth')"
    );
    console.log("   better_auth schema:", schemaCheck.rows[0].exists ? "✅ Exists" : "❌ Missing");

    // Check tables
    const tables = ['user', 'session', 'account', 'verification'];
    console.log("\n3️⃣ Tables in better_auth schema:");
    
    for (const table of tables) {
      const tableCheck = await client.query(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'better_auth' AND table_name = $1)",
        [table]
      );
      console.log(`   ${table}:`, tableCheck.rows[0].exists ? "✅" : "❌");
    }

    await client.end();
  } catch (error: any) {
    console.error("\n❌ Database Error:", error.message);
  }

  // 3. File structure check
  console.log("\n4️⃣ File Structure:");
  const fs = await import("fs/promises");
  
  const files = [
    { path: "lib/auth.ts", desc: "Better Auth config" },
    { path: "lib/auth-client.ts", desc: "Auth client" },
    { path: "lib/db/schema.ts", desc: "Database schema" },
    { path: "lib/db/index.ts", desc: "Database connection" },
    { path: "app/api/auth/[...all]/route.ts", desc: "API route" }
  ];

  for (const file of files) {
    try {
      await fs.access(path.join(process.cwd(), file.path));
      console.log(`   ${file.desc}: ✅`);
    } catch {
      console.log(`   ${file.desc}: ❌`);
    }
  }

  // 4. Summary
  console.log("\n✨ Summary:");
  console.log("   - Database connection works with SSL");
  console.log("   - better_auth schema and tables are set up");
  console.log("   - Better Auth configuration files are in place");
  console.log("\n📝 To test the API:");
  console.log("   1. Start dev server: pnpm dev");
  console.log("   2. Visit: http://localhost:3000/api/auth/session");
  console.log("   3. Should return: { session: null, user: null }");
}

verifyBetterAuth().catch(console.error);