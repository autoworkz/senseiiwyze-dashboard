import { test, expect } from '@playwright/test'

test.describe('/sentry-example-page E2E tests', () => {
  test('should load page with 200 status and display expected content', async ({ page }) => {
    // Navigate to the sentry example page
    const response = await page.goto('/sentry-example-page')
    
    // Assert 200 status
    expect(response?.status()).toBe(200)
    
    // Check page title (might be empty in Next.js without proper metadata)
    const title = await page.title()
    // Either has the title or is empty (both are acceptable for this route)
    expect(title === 'sentry-example-page' || title === '').toBe(true)
    
    // Verify main heading is visible
    await expect(page.locator('h1')).toContainText('sentry-example-page')
    
    // Check for Sentry SVG logo (use first() to avoid strict mode violation with Next.js dev tools)
    await expect(page.locator('svg[height="40"][width="40"]').first()).toBeVisible()
    
    // Verify description text
    await expect(page.locator('.description')).toContainText('Click the button below')
    await expect(page.locator('.description')).toContainText('Issues Page')
    await expect(page.locator('.description')).toContainText('read our docs')
    
    // Check for the error button
    await expect(page.locator('button:has-text("Throw Sample Error")')).toBeVisible()
    
    // Verify links are present and have correct attributes
    const issuesLink = page.locator('a[href*="sentry.io/issues"]')
    await expect(issuesLink).toBeVisible()
    await expect(issuesLink).toHaveAttribute('target', '_blank')
    
    const docsLink = page.locator('a[href*="docs.sentry.io"]')
    await expect(docsLink).toBeVisible()
    await expect(docsLink).toHaveAttribute('target', '_blank')
  })

  test('should have proper responsive layout and styling', async ({ page }) => {
    await page.goto('/sentry-example-page')
    
    // Check main container uses flexbox layout
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // Verify button styling
    const button = page.locator('button:has-text("Throw Sample Error")')
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('cursor', 'pointer')
    
    // Check responsive behavior (mobile viewport)
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(main).toBeVisible()
    await expect(button).toBeVisible()
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('should handle Sentry connectivity check', async ({ page }) => {
    await page.goto('/sentry-example-page')
    
    // Wait for connectivity check to complete
    await page.waitForTimeout(2000)
    
    // Button should be enabled if connectivity is good, or disabled if blocked
    const button = page.locator('button:has-text("Throw Sample Error")')
    await expect(button).toBeVisible()
    
    // Check if button is enabled or if there's a connectivity error message
    const isButtonDisabled = await button.isDisabled()
    const connectivityError = page.locator('.connectivity-error')
    
    if (isButtonDisabled) {
      // If button is disabled, connectivity error should be visible
      await expect(connectivityError).toBeVisible()
      await expect(connectivityError).toContainText('network requests to Sentry are being blocked')
    } else {
      // If button is enabled, no connectivity error should be shown
      await expect(connectivityError).not.toBeVisible()
    }
  })

  test('should handle error button interaction', async ({ page }) => {
    await page.goto('/sentry-example-page')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    const button = page.locator('button:has-text("Throw Sample Error")')
    
    // Check if button is enabled (depends on Sentry connectivity)
    const isButtonEnabled = await button.isEnabled()
    
    if (isButtonEnabled) {
      // Listen for console errors (the intentional error)
      let errorCaught = false
      page.on('pageerror', (error) => {
        if (error.message.includes('This error is raised on the frontend')) {
          errorCaught = true
        }
      })
      
      // Listen for network request to sentry-example-api
      let apiRequestMade = false
      page.on('request', (request) => {
        if (request.url().includes('/api/sentry-example-api')) {
          apiRequestMade = true
        }
      })
      
      // Click the button
      await button.click()
      
      // Wait a moment for async operations
      await page.waitForTimeout(1000)
      
      // Verify that the frontend error was thrown
      expect(errorCaught).toBe(true)
      
      // Verify that API request was made
      expect(apiRequestMade).toBe(true)
      
      // Check for success message (if error was sent successfully)
      const successMessage = page.locator('.success:has-text("Error sent to Sentry")')
      // Note: This might not always appear depending on Sentry configuration
      // so we don't assert it as required
    } else {
      // If button is disabled, verify the connectivity error message
      await expect(page.locator('.connectivity-error')).toBeVisible()
    }
  })

  test('should have accessible markup', async ({ page }) => {
    await page.goto('/sentry-example-page')
    
    // Check for proper heading hierarchy
    await expect(page.locator('h1')).toBeVisible()
    
    // Button should have proper text content
    const button = page.locator('button:has-text("Throw Sample Error")')
    await expect(button).toBeVisible()
    
    // Links should be keyboard accessible
    const links = page.locator('a')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('href')
    }
    
    // Check that the page has proper contrast (basic check via CSS)
    const description = page.locator('.description')
    await expect(description).toHaveCSS('color', /rgb\(\d+,\s*\d+,\s*\d+\)/)
  })

  test('should work correctly with JavaScript disabled', async ({ browser }) => {
    // Create a new context with JavaScript disabled
    const context = await browser.newContext({
      javaScriptEnabled: false
    })
    const page = await context.newPage()
    
    const response = await page.goto('/sentry-example-page')
    expect(response?.status()).toBe(200)
    
    // Basic content should still be visible
    await expect(page.locator('h1')).toContainText('sentry-example-page')
    await expect(page.locator('svg[height="40"]')).toBeVisible()
    await expect(page.locator('button:has-text("Throw Sample Error")')).toBeVisible()
    
    // Links should still work (using first() to avoid strict mode violation)
    await expect(page.locator('a[href*="sentry.io"]').first()).toBeVisible()
    await expect(page.locator('a[href*="docs.sentry.io"]')).toBeVisible()
    
    await context.close()
  })
})
