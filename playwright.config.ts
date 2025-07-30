import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: '.', // Root directory to search from
  testMatch: [
    'e2e/**/*.{spec,test}.{js,ts,jsx,tsx}', // e2e directory tests
    'tests/**/*.e2e.{js,ts,jsx,tsx}', // e2e tests in tests directory
  ],
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Start (or reuse) the local dev server
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}) 