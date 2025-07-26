// Load environment variables FIRST before any imports
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import database modules
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

async function testMinimal() {
  console.log("🔍 Minimal database test...\n");
  
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("DATABASE_URL preview:", process.env.DATABASE_URL?.substring(0, 40) + "...");
  
  try {
    // Create a new connection with SSL
    const queryClient = postgres(process.env.DATABASE_URL!, {
      ssl: 'require'
    });
    
    const db = drizzle(queryClient);
    
    console.log("\n📡 Testing query...");
    const result = await db.execute(sql`SELECT 1 as test, current_database() as db`);
    console.log("✅ Query successful!");
    console.log("Result:", result.rows[0]);
    
    // Clean up
    await queryClient.end();
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testMinimal().catch(console.error);