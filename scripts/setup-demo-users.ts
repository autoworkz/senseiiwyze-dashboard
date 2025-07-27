#!/usr/bin/env tsx

/**
 * Setup Demo Users Script
 * 
 * Creates base/demo users in better-auth if they don't already exist.
 * This is useful for development and testing environments.
 */

import { config } from 'dotenv'
import { authClient } from '../src/lib/auth-client'
import chalk from 'chalk'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

interface DemoUser {
  email: string
  password: string
  name: string
  role?: string
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@senseiiwyze.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'manager@senseiiwyze.com',
    password: 'Manager123!',
    name: 'Manager User',
    role: 'manager'
  },
  {
    email: 'user@senseiiwyze.com',
    password: 'User123!',
    name: 'Demo User',
    role: 'user'
  },
  {
    email: 'test@senseiiwyze.com',
    password: 'Test123!',
    name: 'Test User',
    role: 'user'
  },
  {
    email: 'dev@senseiiwyze.com',
    password: 'Developer123!',
    name: 'Developer User',
    role: 'developer'
  }
]

/**
 * Check if a user exists by trying to sign in
 */
async function userExists(email: string, password: string): Promise<boolean> {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    })
    
    if (result.data?.user) {
      // Sign out after checking
      await authClient.signOut()
      return true
    }
    
    return false
  } catch (error) {
    return false
  }
}

/**
 * Create a single user
 */
async function createUser(user: DemoUser): Promise<boolean> {
  try {
    console.log(chalk.blue(`  🔄 Creating user: ${user.email}`))
    
    const result = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
    })
    
    if (result.error) {
      console.log(chalk.red(`    ❌ Failed: ${result.error.message}`))
      return false
    }
    
    if (result.data?.user) {
      console.log(chalk.green(`    ✅ Created: ${result.data.user.id}`))
      
      // Sign out after creation
      await authClient.signOut()
      return true
    }
    
    console.log(chalk.yellow('    ⚠️  Unknown result'))
    return false
    
  } catch (error) {
    console.log(chalk.red(`    ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
    return false
  }
}

/**
 * Setup all demo users
 */
async function setupDemoUsers() {
  console.log(chalk.cyan('🚀 Setting up demo users for senseiiwyze-dashboard\n'))
  
  // Check environment
  console.log(chalk.blue('📋 Environment Check:'))
  console.log(`  Node Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`  Base URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`)
  console.log('')
  
  let created = 0
  let skipped = 0
  let failed = 0
  
  console.log(chalk.blue('👥 Processing Demo Users:'))
  
  for (const user of demoUsers) {
    try {
      // Check if user already exists
      const exists = await userExists(user.email, user.password)
      
      if (exists) {
        console.log(chalk.yellow(`  ⏭️  Skipping ${user.email} (already exists)`))
        skipped++
        continue
      }
      
      // Create the user
      const success = await createUser(user)
      
      if (success) {
        created++
      } else {
        failed++
      }
      
    } catch (error) {
      console.log(chalk.red(`  ❌ Error processing ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`))
      failed++
    }
    
    // Small delay between users to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  console.log('')
  console.log(chalk.cyan('📊 Summary:'))
  console.log(chalk.green(`  ✅ Created: ${created} users`))
  console.log(chalk.yellow(`  ⏭️  Skipped: ${skipped} users`))
  console.log(chalk.red(`  ❌ Failed: ${failed} users`))
  console.log(`  📝 Total: ${demoUsers.length} users processed`)
  
  if (created > 0) {
    console.log('')
    console.log(chalk.green('🎉 Demo users setup completed!'))
    console.log('')
    console.log(chalk.blue('📝 Login Credentials:'))
    demoUsers.forEach(user => {
      console.log(`  ${user.name} (${user.role || 'user'}):`)
      console.log(`    Email: ${user.email}`)
      console.log(`    Password: ${user.password}`)
      console.log('')
    })
  }
  
  if (failed > 0) {
    console.log('')
    console.log(chalk.red('⚠️  Some users failed to create. Check the logs above for details.'))
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await setupDemoUsers()
  } catch (error) {
    console.error(chalk.red('💥 Fatal error:'), error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Interrupted by user'))
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Terminated'))
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

export { setupDemoUsers, demoUsers } 