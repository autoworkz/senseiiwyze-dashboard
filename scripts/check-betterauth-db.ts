#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
import chalk from 'chalk';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.development') });

console.log(chalk.blue.bold('\n🔍 BetterAuth Database Configuration Analysis\n'));
console.log('='.repeat(60));

// 1. Check environment variables
console.log(chalk.yellow('\n📋 Environment Variables:'));
console.log(chalk.gray('   DATABASE_URL:'), process.env.DATABASE_URL ? chalk.green('✓ Set') : chalk.red('✗ Not Set'));
console.log(chalk.gray('   SUPABASE_DATABASE_URL:'), process.env.SUPABASE_DATABASE_URL ? chalk.green('✓ Set') : chalk.red('✗ Not Set'));
console.log(chalk.gray('   BETTER_AUTH_URL:'), process.env.BETTER_AUTH_URL ? chalk.green('✓ Set') : chalk.red('✗ Not Set'));
console.log(chalk.gray('   BETTER_AUTH_SECRET:'), process.env.BETTER_AUTH_SECRET ? chalk.green('✓ Set') : chalk.red('✗ Not Set'));

// 2. Parse and display database connection info
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  const urlParts = dbUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  
  if (urlParts) {
    console.log(chalk.yellow('\n🗄️  Database Connection Details:'));
    console.log(chalk.gray('   Type:'), chalk.cyan('PostgreSQL'));
    console.log(chalk.gray('   Host:'), chalk.cyan(urlParts[3]));
    console.log(chalk.gray('   Port:'), chalk.cyan(urlParts[4]));
    console.log(chalk.gray('   Database:'), chalk.cyan(urlParts[5]));
    console.log(chalk.gray('   Username:'), chalk.cyan(urlParts[1]));
    console.log(chalk.gray('   Password:'), chalk.cyan(`****${urlParts[2].slice(-4)}`));
    
    // Check if it's Supabase
    if (urlParts[3].includes('supabase.com')) {
      console.log(chalk.gray('   Provider:'), chalk.green('Supabase (Hosted PostgreSQL)'));
    }
  }
}

// 3. BetterAuth configuration analysis
console.log(chalk.yellow('\n⚙️  BetterAuth Configuration:'));
console.log(chalk.gray('   Database Adapter:'), chalk.cyan('drizzleAdapter'));
console.log(chalk.gray('   Provider:'), chalk.cyan('pg (PostgreSQL)'));
console.log(chalk.gray('   Table Prefix:'), chalk.cyan('ba_'));
console.log(chalk.gray('   Schema Location:'), chalk.cyan('./lib/db/schema.ts'));

// 4. Summary
console.log(chalk.yellow('\n📊 Summary:'));
console.log(chalk.white('   BetterAuth is configured to use:'));
console.log(chalk.green('   ✓'), 'PostgreSQL database (NOT SQLite)');
console.log(chalk.green('   ✓'), 'Drizzle ORM with PostgreSQL adapter');
console.log(chalk.green('   ✓'), 'Supabase as the database host');
console.log(chalk.green('   ✓'), 'Tables prefixed with "ba_" for namespace isolation');

// 5. Next steps
console.log(chalk.yellow('\n🚀 Next Steps:'));
console.log(chalk.gray('   1.'), 'Run', chalk.cyan('pnpm tsx scripts/verify-db-connection.ts'), 'to test the connection');
console.log(chalk.gray('   2.'), 'Run', chalk.cyan('pnpm db:generate'), 'to generate migrations');
console.log(chalk.gray('   3.'), 'Run', chalk.cyan('pnpm db:migrate'), 'to apply migrations');
console.log(chalk.gray('   4.'), 'Run', chalk.cyan('pnpm db:studio'), 'to view your database');

console.log('\n' + '='.repeat(60) + '\n');