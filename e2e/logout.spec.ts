import { test, expect } from '@playwright/test'

test('logs in then logs out (session ends)', async ({ page }) => {
  // 1. Sign in with learner demo account
  await page.goto('/login')
  await page.fill('#email', 'learner@demo.com')
  await page.fill('#password', 'Demo@123456710')
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('/me')

  // 2. Trigger logout (direct route call for now)
  await page.goto('/logout')
  await page.waitForURL('/login', { timeout: 5_000 })

  // 3. Verify we’re back at the login page
  await expect(page).toHaveURL(new RegExp('/login$'))
})