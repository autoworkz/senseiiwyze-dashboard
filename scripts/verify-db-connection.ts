#!/usr/bin/env tsx

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import chalk from 'chalk';

// Load environment variables from .env.development
config({ path: '.env.development' });

async function testDatabaseConnection() {
  console.log(chalk.blue('🔍 Testing database connection...'));
  console.log(chalk.gray('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set'));

  if (!process.env.DATABASE_URL) {
    console.log(chalk.red('❌ DATABASE_URL environment variable is not set'));
    console.log(chalk.yellow('💡 Make sure .env.development exists and contains DATABASE_URL'));
    process.exit(1);
  }

  let pool: Pool | null = null;
  
  try {
    // Create PostgreSQL connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Create drizzle instance
    const db = drizzle(pool);

    console.log(chalk.yellow('⏳ Attempting to connect to database...'));

    // Test basic connection with a simple query
    const result = await db.execute(sql`SELECT 1 as test, NOW() as current_time, version() as db_version`);
    
    console.log(chalk.green('✅ Database connection successful!'));
    console.log(chalk.green('📊 Connection details:'));
    console.log(chalk.gray('- Test query result:', result.rows[0]));
    
    // Test database version and basic info
    const versionInfo = result.rows[0] as any;
    console.log(chalk.cyan('🗄️  Database info:'));
    console.log(chalk.gray('- Version:', versionInfo.db_version));
    console.log(chalk.gray('- Current time:', versionInfo.current_time));

    // Test if we can list tables (basic schema access)
    try {
      const tablesResult = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      console.log(chalk.cyan('📋 Available tables:'));
      if (tablesResult.rows.length === 0) {
        console.log(chalk.yellow('   No tables found in public schema'));
      } else {
        tablesResult.rows.forEach((row: any) => {
          console.log(chalk.gray(`   - ${row.table_name}`));
        });
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not list tables (this might be normal for some database configurations)'));
      console.log(chalk.gray('   Error:', (error as Error).message));
    }

    // Test connection pool info
    console.log(chalk.cyan('🔗 Connection pool info:'));
    console.log(chalk.gray('- Total connections:', pool.totalCount));
    console.log(chalk.gray('- Idle connections:', pool.idleCount));
    console.log(chalk.gray('- Waiting clients:', pool.waitingCount));

  } catch (error) {
    console.log(chalk.red('❌ Database connection failed!'));
    console.log(chalk.red('Error details:'));
    
    if (error instanceof Error) {
      console.log(chalk.red('Message:', error.message));
      
      // Common error scenarios
      if (error.message.includes('ENOTFOUND')) {
        console.log(chalk.yellow('💡 This looks like a DNS/host resolution issue. Check your database host.'));
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log(chalk.yellow('💡 Connection refused. Check if the database server is running and the port is correct.'));
      } else if (error.message.includes('authentication failed')) {
        console.log(chalk.yellow('💡 Authentication failed. Check your username and password.'));
      } else if (error.message.includes('SSL')) {
        console.log(chalk.yellow('💡 SSL connection issue. You might need to adjust SSL settings.'));
      } else if (error.message.includes('timeout')) {
        console.log(chalk.yellow('💡 Connection timeout. The database might be slow or unreachable.'));
      }
      
      // Additional debugging info
      console.log(chalk.gray('\n🔧 Debugging info:'));
      console.log(chalk.gray('- NODE_ENV:', process.env.NODE_ENV || 'not set'));
      console.log(chalk.gray('- Database URL format:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@') || 'not set'));
    }
    
    process.exit(1);
  } finally {
    // Clean up connection
    if (pool) {
      await pool.end();
      console.log(chalk.gray('🔌 Database connection closed'));
    }
  }
}

// Run the test
testDatabaseConnection()
  .then(() => {
    console.log(chalk.green('🎉 Database connection test completed successfully!'));
    process.exit(0);
  })
  .catch((error) => {
    console.log(chalk.red('💥 Unexpected error during database test:'));
    console.error(error);
    process.exit(1);
  });
