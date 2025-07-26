import * as dotenv from "dotenv";
import path from "path";
import { Client } from "pg";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
  console.log("🔍 Verifying database connection...\n");
  
  // Debug environment variables (without exposing sensitive data)
  console.log("Environment check:");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 30) + "...");
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Supabase
    }
  });

  try {
    console.log("\n📡 Attempting to connect to database...");
    await client.connect();
    console.log("✅ Successfully connected to database!\n");

    // Test basic query
    const result = await client.query('SELECT current_database(), current_schema(), version()');
    console.log("Database info:");
    console.log("- Current database:", result.rows[0].current_database);
    console.log("- Current schema:", result.rows[0].current_schema);
    console.log("- PostgreSQL version:", result.rows[0].version.split(' ')[1]);

    // Check if better_auth schema exists
    console.log("\n🔍 Checking for better_auth schema...");
    const schemaResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'better_auth'
    `);
    
    if (schemaResult.rows.length > 0) {
      console.log("✅ better_auth schema exists!");
      
      // List tables in better_auth schema
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'better_auth'
        ORDER BY table_name
      `);
      
      console.log("\nTables in better_auth schema:");
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log("❌ better_auth schema not found");
      console.log("\nTo create the schema, run:");
      console.log("CREATE SCHEMA IF NOT EXISTS better_auth;");
    }

  } catch (error) {
    console.error("❌ Connection error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  } finally {
    await client.end();
    console.log("\n🔒 Connection closed");
  }
}

// Run verification
verifyConnection().catch(console.error);