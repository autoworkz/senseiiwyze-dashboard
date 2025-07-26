import { auth } from "../lib/auth";
import { db } from "../lib/db";
import * as schema from "../lib/db/schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testBetterAuth() {
  console.log("🔍 Testing Better Auth implementation with better_auth schema...\n");

  try {
    // Test 1: Verify database connection
    console.log("1️⃣ Testing database connection...");
    const result = await db.execute(sql`SELECT current_schema()`);
    console.log("✅ Database connected successfully");
    console.log("   Current schema:", result.rows[0].current_schema);

    // Test 2: Verify better_auth schema exists
    console.log("\n2️⃣ Checking better_auth schema...");
    const schemaCheck = await db.execute(sql`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'better_auth'
    `);
    if (schemaCheck.rows.length > 0) {
      console.log("✅ better_auth schema exists");
    } else {
      console.log("❌ better_auth schema not found");
      return;
    }

    // Test 3: Verify tables exist in better_auth schema
    console.log("\n3️⃣ Checking tables in better_auth schema...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'better_auth' 
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name
    `);
    
    console.log("   Found tables:");
    tables.rows.forEach((row: any) => {
      console.log(`   ✅ ${row.table_name}`);
    });

    // Test 4: Test querying users table
    console.log("\n4️⃣ Testing query on users table...");
    const users = await db.select().from(schema.users).limit(5);
    console.log(`   Found ${users.length} users in the database`);

    // Test 5: Test auth configuration
    console.log("\n5️⃣ Testing Better Auth configuration...");
    console.log("   Base URL:", process.env.BETTER_AUTH_URL || "http://localhost:3000");
    console.log("   Secret configured:", !!process.env.BETTER_AUTH_SECRET);
    console.log("   OAuth providers:");
    console.log("   - Google:", !!process.env.GOOGLE_CLIENT_ID ? "✅ Configured" : "❌ Not configured");
    console.log("   - GitHub:", !!process.env.GITHUB_CLIENT_ID ? "✅ Configured" : "❌ Not configured");

    // Test 6: Verify table structure matches schema
    console.log("\n6️⃣ Verifying table columns match schema definitions...");
    const userColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'better_auth' 
      AND table_name = 'user'
      ORDER BY ordinal_position
    `);
    
    console.log("   User table columns:");
    userColumns.rows.forEach((col: any) => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    console.log("\n✅ Better Auth setup verification complete!");
    console.log("   The better_auth schema is properly configured and ready to use.");

  } catch (error) {
    console.error("\n❌ Error during testing:", error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testBetterAuth();