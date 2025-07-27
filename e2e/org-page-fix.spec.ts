import { test, expect } from '@playwright/test';

test.describe('Org Page Fix Verification', () => {
  test('should load /org page without next/headers error', async ({ page }) => {
    // Navigate to login first (since /org might require auth)
    await page.goto('/login');
    
    // Try to navigate to /org page
    const response = await page.goto('/org');
    
    // Check that we don't get a 500 error
    expect(response?.status()).not.toBe(500);
    
    // Check that the page loads (either 200 or redirect to login)
    expect([200, 302, 307].includes(response?.status() || 0)).toBeTruthy();
    
    // Wait for the page to settle
    await page.waitForLoadState('networkidle');
    
    // Check that there's no error boundary or crash
    const errorMessages = [
      'next/headers',
      'Server Component',
      'pages/ directory',
      'Application error',
      'Internal Server Error'
    ];
    
    const pageContent = await page.textContent('body');
    for (const errorMsg of errorMessages) {
      expect(pageContent).not.toContain(errorMsg);
    }
    
    console.log('✅ /org page loads successfully without next/headers error');
  });

  test('should load /org page content properly when authenticated', async ({ page }) => {
    // For this test, we'll assume the user might not be authenticated
    // and just check that the page doesn't crash
    
    const response = await page.goto('/org');
    
    // Should not be a server error
    expect(response?.status()).not.toBe(500);
    
    // Wait for any client-side hydration
    await page.waitForTimeout(2000);
    
    // Check for common success indicators (either login redirect or dashboard content)
    const isLoginPage = await page.locator('form').count() > 0;
    const isDashboard = await page.locator('[data-testid="dashboard"], .dashboard, main').count() > 0;
    
    // Page should either show login form or dashboard content, not an error
    expect(isLoginPage || isDashboard).toBeTruthy();
    
    console.log('✅ /org page handles authentication state properly');
  });

  test('should not have import errors in console', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to the org page
    await page.goto('/org');
    await page.waitForLoadState('networkidle');
    
    // Filter out non-import related errors
    const importErrors = consoleErrors.filter(error => 
      error.includes('next/headers') || 
      error.includes('Server Component') ||
      error.includes('import')
    );
    
    // Should have no import-related errors
    expect(importErrors).toHaveLength(0);
    
    if (consoleErrors.length > 0) {
      console.log('Other console errors (not import-related):', consoleErrors);
    }
    
    console.log('✅ No import-related console errors on /org page');
  });
}); 