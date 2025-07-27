#!/usr/bin/env tsx

/**
 * Complete API Test Suite Runner
 * 
 * Runs comprehensive tests for the senseiiwyze-dashboard API and authentication system.
 * Follows the test plan defined in docs/api-test-plan.md
 */

import { config } from 'dotenv'
import chalk from 'chalk'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

// Load environment variables
config({ path: '.env.local' })
config({ path: '.env' })

interface TestResult {
  name: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'passed' | 'failed' | 'skipped' | 'pending'
  duration: number
  error?: string
  script?: string
}

interface TestCategory {
  name: string
  icon: string
  tests: TestScript[]
}

interface TestScript {
  name: string
  script: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  timeout: number
  description: string
}

const testCategories: TestCategory[] = [
  {
    name: 'Critical Authentication',
    icon: '🔐',
    tests: [
      {
        name: 'Email/Password Auth Flow',
        script: 'test-auth-flows.ts',
        priority: 'critical',
        timeout: 30000,
        description: 'Sign up, sign in, sign out, session management'
      },
      {
        name: 'Better Auth API',
        script: 'test-better-auth-api.ts',
        priority: 'critical',
        timeout: 20000,
        description: 'Core API functionality and endpoints'
      },
      {
        name: 'Better Auth Client',
        script: 'test-better-auth-client.ts',
        priority: 'critical',
        timeout: 25000,
        description: 'Client-side authentication functionality'
      }
    ]
  },
  {
    name: 'Two-Factor Authentication',
    icon: '🔒',
    tests: [
      {
        name: '2FA Plugin Test',
        script: 'test-2fa-plugin.ts',
        priority: 'high',
        timeout: 30000,
        description: '2FA setup, login, backup codes'
      }
    ]
  },
  {
    name: 'Social Authentication',
    icon: '🌐',
    tests: [
      {
        name: 'OAuth Providers',
        script: 'test-oauth-providers.ts',
        priority: 'high',
        timeout: 25000,
        description: 'GitHub and Google OAuth (if configured)'
      },
      {
        name: 'GitHub OAuth',
        script: 'test-github-oauth.ts',
        priority: 'high',
        timeout: 20000,
        description: 'GitHub OAuth integration'
      }
    ]
  },
  {
    name: 'Email Integration',
    icon: '📧',
    tests: [
      {
        name: 'Magic Link',
        script: 'test-magic-link.ts',
        priority: 'medium',
        timeout: 25000,
        description: 'Passwordless login via email'
      },
      {
        name: 'Resend Email',
        script: 'test-resend-email.ts',
        priority: 'medium',
        timeout: 15000,
        description: 'Email service integration'
      }
    ]
  },
  {
    name: 'Database & Infrastructure',
    icon: '🗄️',
    tests: [
      {
        name: 'Database Connection',
        script: 'verify-db-connection.ts',
        priority: 'critical',
        timeout: 10000,
        description: 'Database connectivity and health'
      },
      {
        name: 'Schema Validation',
        script: 'introspect-schema.ts',
        priority: 'high',
        timeout: 10000,
        description: 'Database schema integrity'
      },
      {
        name: 'Better Auth Verification',
        script: 'verify-better-auth.ts',
        priority: 'critical',
        timeout: 15000,
        description: 'Better Auth configuration validation'
      }
    ]
  },
  {
    name: 'Configuration & Setup',
    icon: '🔧',
    tests: [
      {
        name: 'Auth Configuration',
        script: 'test-auth-config.ts',
        priority: 'high',
        timeout: 10000,
        description: 'Authentication configuration validation'
      },
      {
        name: 'Implementation Gaps',
        script: 'test-implementation-gaps.ts',
        priority: 'medium',
        timeout: 20000,
        description: 'Production readiness analysis'
      }
    ]
  }
]

/**
 * Run a single test script
 */
async function runTest(test: TestScript, category: string): Promise<TestResult> {
  const startTime = Date.now()
  
  return new Promise((resolve) => {
    console.log(chalk.blue(`    🔄 Running: ${test.name}`))
    
    const scriptPath = path.join(process.cwd(), 'scripts', test.script)
    const child = spawn('pnpm', ['tsx', scriptPath], {
      stdio: 'pipe',
      timeout: test.timeout
    })
    
    let output = ''
    let errorOutput = ''
    
    child.stdout?.on('data', (data) => {
      output += data.toString()
    })
    
    child.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    child.on('close', (code) => {
      const duration = Date.now() - startTime
      
      if (code === 0) {
        console.log(chalk.green(`      ✅ Passed (${duration}ms)`))
        resolve({
          name: test.name,
          category,
          priority: test.priority,
          status: 'passed',
          duration,
          script: test.script
        })
      } else {
        console.log(chalk.red(`      ❌ Failed (${duration}ms)`))
        if (errorOutput) {
          console.log(chalk.gray(`         ${errorOutput.trim()}`))
        }
        resolve({
          name: test.name,
          category,
          priority: test.priority,
          status: 'failed',
          duration,
          error: errorOutput || `Exit code: ${code}`,
          script: test.script
        })
      }
    })
    
    child.on('error', (error) => {
      const duration = Date.now() - startTime
      console.log(chalk.red(`      ❌ Error (${duration}ms): ${error.message}`))
      resolve({
        name: test.name,
        category,
        priority: test.priority,
        status: 'failed',
        duration,
        error: error.message,
        script: test.script
      })
    })
    
    // Handle timeout
    setTimeout(() => {
      if (!child.killed) {
        child.kill()
        const duration = Date.now() - startTime
        console.log(chalk.yellow(`      ⏰ Timeout (${duration}ms)`))
        resolve({
          name: test.name,
          category,
          priority: test.priority,
          status: 'failed',
          duration,
          error: 'Test timeout',
          script: test.script
        })
      }
    }, test.timeout)
  })
}

/**
 * Run tests by priority level
 */
async function runTestsByPriority(
  priority: 'critical' | 'high' | 'medium' | 'low',
  categories: TestCategory[]
): Promise<TestResult[]> {
  console.log(chalk.cyan(`\n📋 Running ${priority.toUpperCase()} priority tests...\n`))
  
  const results: TestResult[] = []
  
  for (const category of categories) {
    const categoryTests = category.tests.filter(test => test.priority === priority)
    
    if (categoryTests.length === 0) continue
    
    console.log(chalk.cyan(`  ${category.icon} ${category.name}`))
    
    for (const test of categoryTests) {
      try {
        const result = await runTest(test, category.name)
        results.push(result)
      } catch (error) {
        console.log(chalk.red(`      💥 Fatal error: ${error}`))
        results.push({
          name: test.name,
          category: category.name,
          priority: test.priority,
          status: 'failed',
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          script: test.script
        })
      }
    }
  }
  
  return results
}

/**
 * Generate test report
 */
function generateReport(results: TestResult[]) {
  console.log(chalk.cyan('\n📊 Test Results Summary\n'))
  
  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    skipped: results.filter(r => r.status === 'skipped').length
  }
  
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
  
  console.log(`📈 Overall Results:`)
  console.log(chalk.green(`  ✅ Passed: ${stats.passed}/${stats.total}`))
  console.log(chalk.red(`  ❌ Failed: ${stats.failed}/${stats.total}`))
  console.log(chalk.yellow(`  ⏭️  Skipped: ${stats.skipped}/${stats.total}`))
  console.log(`  ⏱️  Total Duration: ${totalDuration}ms`)
  
  // Group by category
  const byCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, TestResult[]>)
  
  console.log('\n📋 Results by Category:')
  Object.entries(byCategory).forEach(([category, categoryResults]) => {
    const categoryPassed = categoryResults.filter(r => r.status === 'passed').length
    const categoryTotal = categoryResults.length
    const categoryIcon = categoryPassed === categoryTotal ? '✅' : '❌'
    
    console.log(`  ${categoryIcon} ${category}: ${categoryPassed}/${categoryTotal}`)
    
    // Show failed tests
    const failedTests = categoryResults.filter(r => r.status === 'failed')
    failedTests.forEach(test => {
      console.log(chalk.red(`    ❌ ${test.name}`))
      if (test.error) {
        console.log(chalk.gray(`       ${test.error.split('\n')[0]}`))
      }
    })
  })
  
  // Critical test failures
  const criticalFailures = results.filter(r => r.priority === 'critical' && r.status === 'failed')
  if (criticalFailures.length > 0) {
    console.log(chalk.red('\n🚨 CRITICAL TEST FAILURES:'))
    criticalFailures.forEach(test => {
      console.log(chalk.red(`  ❌ ${test.name} (${test.category})`))
    })
  }
  
  return stats
}

/**
 * Save test results to file
 */
async function saveResults(results: TestResult[]) {
  const reportData = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      duration: results.reduce((sum, r) => sum + r.duration, 0)
    }
  }
  
  const reportPath = path.join(process.cwd(), 'test-results.json')
  await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2))
  console.log(chalk.blue(`\n📄 Test results saved to: ${reportPath}`))
}

/**
 * Main test runner
 */
async function runCompleteTestSuite() {
  console.log(chalk.cyan('🚀 Complete API Test Suite - senseiiwyze-dashboard\n'))
  
  // Environment check
  console.log(chalk.blue('📋 Environment Check:'))
  console.log(`  Node Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`  Base URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`)
  console.log(`  Database: ${process.env.DATABASE_URL ? 'Configured' : 'Default (SQLite)'}`)
  console.log('')
  
  const allResults: TestResult[] = []
  
  try {
    // Run tests by priority
    const priorities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low']
    
    for (const priority of priorities) {
      const results = await runTestsByPriority(priority, testCategories)
      allResults.push(...results)
      
      // Stop on critical failures if requested
      const criticalFailures = results.filter(r => r.priority === 'critical' && r.status === 'failed')
      if (criticalFailures.length > 0 && priority === 'critical') {
        console.log(chalk.red('\n🛑 Critical tests failed. Stopping execution.'))
        break
      }
    }
    
    // Generate final report
    const stats = generateReport(allResults)
    
    // Save results
    await saveResults(allResults)
    
    // Exit with appropriate code
    if (stats.failed > 0) {
      console.log(chalk.red('\n💥 Some tests failed!'))
      process.exit(1)
    } else {
      console.log(chalk.green('\n🎉 All tests passed!'))
      process.exit(0)
    }
    
  } catch (error) {
    console.error(chalk.red('💥 Fatal error running test suite:'), error)
    process.exit(1)
  }
}

/**
 * Handle command line arguments
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: pnpm tsx scripts/test-api-complete.ts [options]

Options:
  --help, -h          Show this help message
  --critical          Run only critical tests
  --high             Run critical and high priority tests
  --category <name>   Run tests for specific category
  
Examples:
  pnpm tsx scripts/test-api-complete.ts                 # Run all tests
  pnpm tsx scripts/test-api-complete.ts --critical      # Run only critical tests
  pnpm tsx scripts/test-api-complete.ts --high          # Run critical + high tests
`)
    return
  }
  
  if (args.includes('--critical')) {
    console.log(chalk.cyan('🎯 Running CRITICAL tests only\n'))
    const results = await runTestsByPriority('critical', testCategories)
    const stats = generateReport(results)
    process.exit(stats.failed > 0 ? 1 : 0)
    return
  }
  
  if (args.includes('--high')) {
    console.log(chalk.cyan('🎯 Running CRITICAL and HIGH priority tests\n'))
    const criticalResults = await runTestsByPriority('critical', testCategories)
    const highResults = await runTestsByPriority('high', testCategories)
    const allResults = [...criticalResults, ...highResults]
    const stats = generateReport(allResults)
    process.exit(stats.failed > 0 ? 1 : 0)
    return
  }
  
  // Run complete test suite
  await runCompleteTestSuite()
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Test suite interrupted'))
  process.exit(130)
})

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 Test suite terminated'))
  process.exit(143)
})

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

export { runCompleteTestSuite, testCategories } 