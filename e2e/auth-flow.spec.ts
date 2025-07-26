import { test, expect } from '@playwright/test'

test('basic auth flow smoke test', async ({ page }) => {
  // 1. Go to login page
  await page.goto('http://localhost:3000/auth/login')
  
  // 2. Verify login page loads
  await expect(page.locator('h1')).toContainText('Welcome to SenseiiWyze')
  
  // 3. Check that social login buttons exist
  await expect(page.locator('button:has-text("Continue with GitHub")')).toBeVisible()
  await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()
  
  // 4. Verify email/password fields exist
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
  
  // 5. Navigate to settings page (should redirect to login if not authenticated)
  await page.goto('http://localhost:3000/settings')
  await expect(page).toHaveURL(/auth\/login/)
  
  console.log('✅ Basic auth flow test passed')
})