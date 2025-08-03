import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    // Check if ba_ tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'ba_%'
      ORDER BY table_name;
    `);
    
    console.log('Better Auth tables found:');
    console.log(tables.rows);
    
    // Check specifically for our usage tracking tables
    const usageTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('ba_usage_tracking', 'ba_usage_summary', 'ba_credit_balance', 'ba_credit_transactions')
      ORDER BY table_name;
    `);
    
    console.log('\nUsage tracking tables found:');
    console.log(usageTables.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking tables:', error);
    process.exit(1);
  }
}

checkTables();