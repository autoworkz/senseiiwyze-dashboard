#!/usr/bin/env tsx

/**
 * Database Seeder Script
 *
 * Main orchestrator for seeding demo data into the database.
 * Run with: pnpm seed
 */

import chalk from 'chalk'
import { config } from 'dotenv'
import { seedActivities } from './seeds/seed-activities'
import { seedAssessments } from './seeds/seed-assessments'
import { seedCategories } from './seeds/seed-categories'
import { seedEvaluations } from './seeds/seed-evaluations'
import { seedUserProfiles } from './seeds/seed-profiles'
import { seedVisionBoards } from './seeds/seed-vision-boards'
import { seedWorkplaces } from './seeds/seed-workplaces'
import { setupDemoUsers } from './setup-demo-users'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

interface SeedOptions {
  users?: boolean
  workplaces?: boolean
  assessments?: boolean
  activities?: boolean
  profiles?: boolean
  visionBoards?: boolean
  evaluations?: boolean
  all?: boolean
}

/**
 * Parse command line arguments
 */
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2)
  const options: SeedOptions = {}

  if (args.length === 0 || args.includes('--all')) {
    options.all = true
  } else {
    options.users = args.includes('--users')
    options.workplaces = args.includes('--workplaces')
    options.assessments = args.includes('--assessments')
    options.activities = args.includes('--activities')
    options.profiles = args.includes('--profiles')
    options.visionBoards = args.includes('--vision-boards')
    options.evaluations = args.includes('--evaluations')
  }

  return options
}

/**
 * Display usage information
 */
function showUsage() {
  console.log(chalk.cyan('\n📚 Database Seeder Usage:\n'))
  console.log('  pnpm seed                    # Seed all data')
  console.log('  pnpm seed --all              # Seed all data')
  console.log('  pnpm seed --users            # Seed demo users only')
  console.log('  pnpm seed --workplaces       # Seed workplaces only')
  console.log('  pnpm seed --assessments      # Seed assessments & questions')
  console.log('  pnpm seed --activities       # Seed categories & activities')
  console.log('  pnpm seed --profiles         # Seed user profiles')
  console.log('  pnpm seed --vision-boards    # Seed vision boards & goals')
  console.log('  pnpm seed --evaluations      # Seed evaluations & answers')
  console.log('')
}

/**
 * Main seeding function
 */
async function seedDatabase(options: SeedOptions) {
  console.log(chalk.cyan('🌱 Starting Database Seeding...\n'))

  const startTime = Date.now()
  let totalCreated = 0
  let totalSkipped = 0
  let totalFailed = 0

  try {
    // Always seed users first as they're dependencies for other data
    if (options.all || options.users) {
      console.log(chalk.blue('👥 Seeding Demo Users...'))
      await setupDemoUsers()
      console.log('')
    }

    // Seed workplaces (organizations)
    if (options.all || options.workplaces) {
      console.log(chalk.blue('🏢 Seeding Workplaces...'))
      const result = await seedWorkplaces()
      totalCreated += result.created
      totalSkipped += result.skipped
      totalFailed += result.failed
      console.log('')
    }

    // Seed assessments and questions
    if (options.all || options.assessments) {
      console.log(chalk.blue('📋 Seeding Assessments & Questions...'))
      const result = await seedAssessments()
      totalCreated += result.created
      totalSkipped += result.skipped
      totalFailed += result.failed
      console.log('')
    }

    // Seed categories and activities
    if (options.all || options.activities) {
      console.log(chalk.blue('🎮 Seeding Categories & Activities...'))
      const catResult = await seedCategories()
      const actResult = await seedActivities()
      totalCreated += catResult.created + actResult.created
      totalSkipped += catResult.skipped + actResult.skipped
      totalFailed += catResult.failed + actResult.failed
      console.log('')
    }

    // Seed user profiles with relationships
    if (options.all || options.profiles) {
      console.log(chalk.blue('👤 Seeding User Profiles...'))
      const result = await seedUserProfiles()
      totalCreated += result.created
      totalSkipped += result.skipped
      totalFailed += result.failed
      console.log('')
    }

    // Seed vision boards and goals
    if (options.all || options.visionBoards) {
      console.log(chalk.blue('🎯 Seeding Vision Boards & Goals...'))
      const result = await seedVisionBoards()
      totalCreated += result.created
      totalSkipped += result.skipped
      totalFailed += result.failed
      console.log('')
    }

    // Seed evaluations and answers
    if (options.all || options.evaluations) {
      console.log(chalk.blue('📊 Seeding Evaluations & Answers...'))
      const result = await seedEvaluations()
      totalCreated += result.created
      totalSkipped += result.skipped
      totalFailed += result.failed
      console.log('')
    }

    // Final summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(chalk.cyan('📊 Seeding Summary:'))
    console.log(chalk.green(`  ✅ Created: ${totalCreated} records`))
    console.log(chalk.yellow(`  ⏭️  Skipped: ${totalSkipped} records`))
    console.log(chalk.red(`  ❌ Failed: ${totalFailed} records`))
    console.log(chalk.blue(`  ⏱️  Duration: ${duration}s`))
    console.log('')

    if (totalCreated > 0) {
      console.log(chalk.green('🎉 Database seeding completed successfully!'))

      // Show helpful next steps
      console.log(chalk.cyan('\n📝 Next Steps:'))
      console.log('  1. Start the development server: pnpm dev')
      console.log('  2. Visit http://localhost:3000')
      console.log('  3. Login with one of the demo accounts')
      console.log('')
    }
  } catch (error) {
    console.error(chalk.red('💥 Fatal error during seeding:'), error)
    process.exit(1)
  }
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs()

  // Show usage if requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage()
    process.exit(0)
  }

  // Check if any options are selected
  const hasOptions = Object.values(options).some((v) => v === true)
  if (!hasOptions) {
    options.all = true
  }

  await seedDatabase(options)
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Seeding interrupted by user'))
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Seeding terminated'))
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

export { seedDatabase, type SeedOptions }
