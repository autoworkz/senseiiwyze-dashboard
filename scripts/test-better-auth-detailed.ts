// Load environment variables FIRST
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import after env vars are loaded
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "../lib/db/schema";

async function testBetterAuthDetailed() {
  console.log("🔍 Detailed Better Auth Test\n");
  
  console.log("1️⃣ Environment Check:");
  console.log("   DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("   BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
  console.log("   BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
  
  try {
    // Test 1: Basic connection
    console.log("\n2️⃣ Testing basic database connection...");
    const queryClient = postgres(process.env.DATABASE_URL!, {
      ssl: 'require'
    });
    
    const db = drizzle(queryClient, { schema });
    
    const basicResult = await db.execute(sql`SELECT 1 as test`);
    console.log("   ✅ Basic connection successful");
    
    // Test 2: Schema exists
    console.log("\n3️⃣ Checking better_auth schema...");
    const schemaResult = await db.execute(sql`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'better_auth'
    `);
    
    if (schemaResult.rows.length > 0) {
      console.log("   ✅ better_auth schema exists");
    } else {
      console.log("   ❌ better_auth schema NOT found");
      await queryClient.end();
      return;
    }
    
    // Test 3: Tables exist
    console.log("\n4️⃣ Checking Better Auth tables...");
    const tables = ['user', 'session', 'account', 'verification'];
    
    for (const table of tables) {
      const tableResult = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'better_auth' 
        AND table_name = ${table}
      `);
      
      if (tableResult.rows.length > 0) {
        console.log(`   ✅ Table 'better_auth.${table}' exists`);
      } else {
        console.log(`   ❌ Table 'better_auth.${table}' NOT found`);
      }
    }
    
    // Test 4: Try to query the user table
    console.log("\n5️⃣ Testing query on better_auth.user table...");
    try {
      const userCountResult = await db.execute(
        sql`SELECT COUNT(*) as count FROM better_auth."user"`
      );
      console.log(`   ✅ Can query user table (${userCountResult.rows[0].count} users)`);
    } catch (error) {
      console.log("   ❌ Cannot query user table:", error);
    }
    
    // Test 5: Better Auth configuration
    console.log("\n6️⃣ Testing Better Auth configuration...");
    try {
      const { auth } = await import("../lib/auth");
      console.log("   ✅ Better Auth imported successfully");
      console.log("   📍 Base URL:", process.env.BETTER_AUTH_URL);
      console.log("   🔐 Secret configured:", !!process.env.BETTER_AUTH_SECRET);
    } catch (error) {
      console.log("   ❌ Better Auth import failed:", error);
    }
    
    // Test 6: API route exists
    console.log("\n7️⃣ Checking API route file...");
    const fs = await import("fs/promises");
    const apiRoutePath = path.join(process.cwd(), "app/api/auth/[...all]/route.ts");
    
    try {
      await fs.access(apiRoutePath);
      console.log("   ✅ API route file exists");
    } catch {
      console.log("   ❌ API route file NOT found");
    }
    
    console.log("\n✨ Test Summary:");
    console.log("   Database connection: ✅");
    console.log("   Schema and tables: Check results above");
    console.log("   Better Auth config: Check results above");
    console.log("\n📝 Next Steps:");
    console.log("   1. Ensure all environment variables are set");
    console.log("   2. Start the dev server: pnpm dev");
    console.log("   3. Test authentication endpoints at /api/auth/*");
    
    await queryClient.end();
    
  } catch (error) {
    console.error("\n❌ Test failed:", error);
  }
}

testBetterAuthDetailed().catch(console.error);