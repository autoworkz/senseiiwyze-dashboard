import { test } from '@playwright/test'

// Skipped until magic-link auth is wired up end-to-end
test.skip('authenticates via magic-link without password', async ({ page }) => {
  /* Planned steps:
     1. Request magic link on /login via “Send Magic Link”
     2. Capture the link (mock or intercept)
     3. Visit the link and verify user is logged in / redirected
  */
})