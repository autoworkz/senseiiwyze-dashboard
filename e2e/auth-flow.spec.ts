import { test, expect } from '@playwright/test'

test('basic auth flow smoke test', async ({ page }) => {
  // 1. Go to login page
  await page.goto('http://localhost:3000/auth/login')
  
  // 2. Verify login page loads
  await expect(page.locator('h1')).toContainText('Welcome to SenseiiWyze')
  
  // 3. Check that social login buttons exist
  await expect(page.locator('button:has-text("Google")')).toBeVisible()
  await expect(page.locator('button:has-text("GitHub")')).toBeVisible()
  
  // 4. Verify email/password fields exist
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
  
  // 5. Check Sign In button exists
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
  
  console.log('✅ Basic auth flow test passed')
  
  // TODO: Once middleware is fixed, add test for:
  // - Navigate to /settings when not authenticated -> redirects to /auth/login
  // - Login with credentials -> redirects to dashboard
  // - Logout -> redirects back to /auth/login
})