# Chrome MCP Testing Workflow

> Status: **Ready for Execution**
> Last Updated: 2025-07-29
> Project: SenseiiWyze Dashboard Internationalization Testing

## Overview

This document provides the complete Chrome MCP testing workflow for validating the SenseiiWyze Dashboard across all 5 supported locales with comprehensive quality assurance.

## Testing Environment Setup

### Prerequisites
- Development server running on `http://localhost:3000`
- Chrome MCP server connected and functional  
- All 5 locales configured: `en`, `es`, `fr`, `de`, `ja`
- Valid test user accounts for each role type

### Chrome Configuration
```typescript
const chromeTestConfig = {
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  headless: false, // Visual debugging enabled
  devtools: true,
  userAgent: 'SenseiiWyze-TestBot/1.0',
  locale: 'en-US' // Base locale for Chrome
};
```

## Testing Workflows

### Workflow 1: Systematic Page Load Testing

#### Objective
Verify all pages load successfully across all locales without errors.

#### Test Matrix
```typescript
const testMatrix = {
  locales: ['en', 'es', 'fr', 'de', 'ja'],
  routes: [
    // Platform Admin Routes
    '/platform/users/list',
    '/platform/users/analytics', 
    '/platform/analytics',
    '/platform/data-overview',
    
    // Enterprise Routes  
    '/enterprise/org',
    '/enterprise/programs',
    '/enterprise/program-readiness-dashboard',
    '/enterprise/org/reports',
    '/enterprise/org/presentation',
    
    // Coach Routes
    '/coach/team',
    '/coach/team/users',
    '/coach/team/tasks', 
    '/coach/team/messages',
    '/coach/team/courses',
    
    // Learner Routes
    '/learner/me',
    '/learner/user-dashboard',
    '/learner/me/learn',
    '/learner/me/goals',
    '/learner/me/games',
    
    // Shared Routes
    '/shared/settings',
    '/shared/skills',
    '/shared/test-readiness',
    '/shared/tickets'
  ]
};
```

#### Implementation
```typescript
async function executePageLoadTesting() {
  const results = [];
  
  for (const locale of testMatrix.locales) {
    for (const route of testMatrix.routes) {
      const testUrl = `http://localhost:3000/${locale}${route}`;
      
      try {
        // Navigate to page
        await chrome.navigate({ url: testUrl });
        
        // Wait for page load
        await chrome.waitFor({ time: 3000 });
        
        // Capture performance metrics
        const performanceMetrics = await chrome.evaluate({
          function: `() => ({
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
          })`
        });
        
        // Check for console errors
        const consoleMessages = await chrome.consoleMessages();
        const errors = consoleMessages.filter(msg => msg.type === 'error');
        
        // Take screenshot
        const screenshotPath = `screenshots/${locale}-${route.replace(/\//g, '-')}.png`;
        await chrome.takeScreenshot({ 
          filename: screenshotPath,
          fullPage: true 
        });
        
        // Capture page snapshot for content analysis
        const snapshot = await chrome.snapshot();
        
        results.push({
          locale,
          route,
          url: testUrl,
          status: 'success',
          loadTime: performanceMetrics.loadTime,
          errors: errors,
          screenshot: screenshotPath,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        results.push({
          locale,
          route,
          url: testUrl,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  return results;
}
```

### Workflow 2: Interactive Element Testing

#### Objective  
Verify interactive elements function correctly across all locales.

#### Test Scenarios
1. **Locale Switcher Testing**
2. **Navigation Menu Testing**
3. **Form Input Testing**
4. **Modal Dialog Testing**
5. **Dropdown Menu Testing**
6. **Button Functionality Testing**

#### Implementation
```typescript
async function executeInteractionTesting() {
  const results = [];
  
  for (const locale of testMatrix.locales) {
    // Test locale switcher
    await chrome.navigate({ url: `http://localhost:3000/${locale}/platform/users/list` });
    
    // Find and click locale switcher
    const snapshot = await chrome.snapshot();
    
    // Look for locale switcher button
    await chrome.click({ 
      element: "locale switcher button", 
      ref: "locale-switcher" 
    });
    
    // Wait for dropdown to appear
    await chrome.waitFor({ time: 1000 });
    
    // Test switching to different locale
    const targetLocale = locale === 'en' ? 'es' : 'en';
    await chrome.click({ 
      element: `${targetLocale} locale option`, 
      ref: `locale-${targetLocale}` 
    });
    
    // Verify URL changed
    const newUrl = await chrome.evaluate({
      function: "() => window.location.href"
    });
    
    const urlChanged = newUrl.includes(`/${targetLocale}/`);
    
    results.push({
      test: 'locale-switcher',
      originalLocale: locale,
      targetLocale: targetLocale,
      success: urlChanged,
      newUrl: newUrl
    });
    
    // Test navigation menus
    await testNavigationMenus(locale, results);
    
    // Test form interactions
    await testFormInteractions(locale, results);
    
    // Test modal dialogs
    await testModalDialogs(locale, results);
  }
  
  return results;
}

async function testNavigationMenus(locale, results) {
  // Navigate to main dashboard
  await chrome.navigate({ url: `http://localhost:3000/${locale}/platform` });
  
  // Test primary navigation
  const navItems = [
    { name: 'Users', ref: 'nav-users' },
    { name: 'Analytics', ref: 'nav-analytics' },
    { name: 'Settings', ref: 'nav-settings' }
  ];
  
  for (const item of navItems) {
    try {
      await chrome.click({ 
        element: `${item.name} navigation item`, 
        ref: item.ref 
      });
      
      await chrome.waitFor({ time: 1000 });
      
      const currentUrl = await chrome.evaluate({
        function: "() => window.location.href"
      });
      
      results.push({
        test: 'navigation',
        locale: locale,
        item: item.name,
        success: true,
        url: currentUrl
      });
      
    } catch (error) {
      results.push({
        test: 'navigation',
        locale: locale,
        item: item.name,
        success: false,
        error: error.message
      });
    }
  }
}

async function testFormInteractions(locale, results) {
  // Navigate to a page with forms (e.g., settings)
  await chrome.navigate({ url: `http://localhost:3000/${locale}/shared/settings` });
  
  // Test form input
  try {
    await chrome.type({
      element: "name input field",
      ref: "profile-name-input",
      text: "Test User Name"
    });
    
    // Test form submission
    await chrome.click({
      element: "save button",
      ref: "save-profile-button"
    });
    
    await chrome.waitFor({ time: 2000 });
    
    // Check for success message
    const snapshot = await chrome.snapshot();
    
    results.push({
      test: 'form-interaction',
      locale: locale,
      success: true,
      action: 'profile-update'
    });
    
  } catch (error) {
    results.push({
      test: 'form-interaction',
      locale: locale,
      success: false,
      error: error.message
    });
  }
}

async function testModalDialogs(locale, results) {
  // Navigate to page with modals
  await chrome.navigate({ url: `http://localhost:3000/${locale}/platform/users/list` });
  
  try {
    // Click button that opens modal
    await chrome.click({
      element: "add user button",
      ref: "add-user-modal-trigger"
    });
    
    await chrome.waitFor({ time: 1000 });
    
    // Verify modal opened
    const snapshot = await chrome.snapshot();
    
    // Close modal
    await chrome.click({
      element: "close modal button",
      ref: "modal-close-button"
    });
    
    results.push({
      test: 'modal-dialog',
      locale: locale,
      success: true,
      action: 'open-close-modal'
    });
    
  } catch (error) {
    results.push({
      test: 'modal-dialog',
      locale: locale,
      success: false,
      error: error.message
    });
  }
}
```

### Workflow 3: Authentication Flow Testing

#### Objective
Verify authentication works correctly across all locales.

#### Test Scenarios
1. **Login Process**
2. **Logout Process**  
3. **Registration Process**
4. **Password Reset**
5. **OAuth Providers**

#### Implementation
```typescript
async function executeAuthenticationTesting() {
  const results = [];
  
  for (const locale of testMatrix.locales) {
    // Test login flow
    await testLoginFlow(locale, results);
    
    // Test logout flow
    await testLogoutFlow(locale, results);
    
    // Test registration flow
    await testRegistrationFlow(locale, results);
  }
  
  return results;
}

async function testLoginFlow(locale, results) {
  try {
    // Navigate to login page
    await chrome.navigate({ url: `http://localhost:3000/${locale}/auth/login` });
    
    // Fill login form
    await chrome.type({
      element: "email input",
      ref: "login-email",
      text: "test@senseiiwyze.com"
    });
    
    await chrome.type({
      element: "password input", 
      ref: "login-password",
      text: "TestPassword123!"
    });
    
    // Submit form
    await chrome.click({
      element: "login button",
      ref: "login-submit"
    });
    
    // Wait for redirect
    await chrome.waitFor({ time: 3000 });
    
    // Verify successful login (check for dashboard)
    const currentUrl = await chrome.evaluate({
      function: "() => window.location.href"
    });
    
    const loginSuccess = currentUrl.includes('/platform') || currentUrl.includes('/dashboard');
    
    results.push({
      test: 'authentication-login',
      locale: locale,
      success: loginSuccess,
      finalUrl: currentUrl
    });
    
  } catch (error) {
    results.push({
      test: 'authentication-login',
      locale: locale,
      success: false,
      error: error.message
    });
  }
}

async function testLogoutFlow(locale, results) {
  try {
    // Ensure we're logged in first
    await chrome.navigate({ url: `http://localhost:3000/${locale}/platform` });
    
    // Click user menu
    await chrome.click({
      element: "user menu button",
      ref: "user-menu-trigger"
    });
    
    await chrome.waitFor({ time: 500 });
    
    // Click logout
    await chrome.click({
      element: "logout button",
      ref: "logout-button"
    });
    
    // Wait for redirect
    await chrome.waitFor({ time: 2000 });
    
    // Verify logout (should be on login/home page)
    const currentUrl = await chrome.evaluate({
      function: "() => window.location.href"
    });
    
    const logoutSuccess = currentUrl.includes('/auth/login') || currentUrl.includes(`/${locale}/`);
    
    results.push({
      test: 'authentication-logout',
      locale: locale,
      success: logoutSuccess,
      finalUrl: currentUrl
    });
    
  } catch (error) {
    results.push({
      test: 'authentication-logout',
      locale: locale,
      success: false,
      error: error.message
    });
  }
}
```

### Workflow 4: Accessibility Testing

#### Objective
Ensure accessibility compliance across all locales.

#### Test Areas
1. **Keyboard Navigation**
2. **Screen Reader Compatibility**
3. **Color Contrast**
4. **ARIA Labels**
5. **Focus Management**

#### Implementation
```typescript
async function executeAccessibilityTesting() {
  const results = [];
  
  for (const locale of testMatrix.locales) {
    for (const route of testMatrix.routes.slice(0, 5)) { // Test key routes
      try {
        await chrome.navigate({ url: `http://localhost:3000/${locale}${route}` });
        
        // Test keyboard navigation
        await testKeyboardNavigation(locale, route, results);
        
        // Test focus management
        await testFocusManagement(locale, route, results);
        
        // Evaluate accessibility with automated checks
        const accessibilityScore = await chrome.evaluate({
          function: `() => {
            // Run basic accessibility checks
            const focusableElements = document.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            let score = 100;
            let issues = [];
            
            // Check for missing alt text on images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
              if (!img.alt && !img.getAttribute('aria-label')) {
                score -= 10;
                issues.push('Missing alt text on image');
              }
            });
            
            // Check for missing labels on form inputs
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
              if (!input.labels?.length && !input.getAttribute('aria-label')) {
                score -= 15;
                issues.push('Missing label on form input');
              }
            });
            
            return { score: Math.max(0, score), issues };
          }`
        });
        
        results.push({
          test: 'accessibility-audit',
          locale: locale,
          route: route,
          score: accessibilityScore.score,
          issues: accessibilityScore.issues,
          success: accessibilityScore.score >= 80
        });
        
      } catch (error) {
        results.push({
          test: 'accessibility-audit',
          locale: locale,
          route: route,
          success: false,
          error: error.message
        });
      }
    }
  }
  
  return results;
}

async function testKeyboardNavigation(locale, route, results) {
  try {
    // Test tab navigation
    await chrome.pressKey({ key: 'Tab' });
    await chrome.waitFor({ time: 200 });
    
    await chrome.pressKey({ key: 'Tab' });
    await chrome.waitFor({ time: 200 });
    
    await chrome.pressKey({ key: 'Tab' });
    await chrome.waitFor({ time: 200 });
    
    // Test enter key on focused element
    await chrome.pressKey({ key: 'Enter' });
    await chrome.waitFor({ time: 1000 });
    
    results.push({
      test: 'keyboard-navigation',
      locale: locale,
      route: route,
      success: true
    });
    
  } catch (error) {
    results.push({
      test: 'keyboard-navigation',
      locale: locale,
      route: route,
      success: false,
      error: error.message
    });
  }
}
```

### Workflow 5: Performance Testing

#### Objective
Measure and validate performance across all locales.

#### Metrics
- Page Load Time
- Time to First Contentful Paint
- Time to Interactive
- Bundle Size Impact
- Translation Loading Time

#### Implementation
```typescript
async function executePerformanceTesting() {
  const results = [];
  
  for (const locale of testMatrix.locales) {
    for (const route of testMatrix.routes.slice(0, 10)) { // Test key routes
      try {
        const startTime = Date.now();
        
        await chrome.navigate({ url: `http://localhost:3000/${locale}${route}` });
        
        // Wait for page to fully load
        await chrome.waitFor({ time: 3000 });
        
        const endTime = Date.now();
        const totalLoadTime = endTime - startTime;
        
        // Get detailed performance metrics
        const performanceData = await chrome.evaluate({
          function: `() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
              firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
              transferSize: navigation.transferSize,
              encodedBodySize: navigation.encodedBodySize
            };
          }`
        });
        
        results.push({
          test: 'performance',
          locale: locale,
          route: route,
          totalLoadTime: totalLoadTime,
          domContentLoaded: performanceData.domContentLoaded,
          firstContentfulPaint: performanceData.firstContentfulPaint,
          transferSize: performanceData.transferSize,
          success: totalLoadTime < 5000 // 5 second threshold
        });
        
      } catch (error) {
        results.push({
          test: 'performance',
          locale: locale,
          route: route,
          success: false,
          error: error.message
        });
      }
    }
  }
  
  return results;
}
```

## Test Execution Order

### Sequential Execution Plan
1. **Setup Phase** (5 minutes)
   - Initialize Chrome MCP connection
   - Verify development server accessibility
   - Create screenshot directories

2. **Page Load Testing** (30 minutes)
   - Execute systematic page load tests
   - Capture screenshots and performance data
   - Log any critical errors

3. **Interactive Testing** (45 minutes)  
   - Test locale switcher functionality
   - Validate navigation menus
   - Test form interactions and modals

4. **Authentication Testing** (20 minutes)
   - Test login/logout flows
   - Verify OAuth provider integration
   - Test session management

5. **Accessibility Testing** (25 minutes)
   - Keyboard navigation testing
   - Screen reader compatibility checks
   - ARIA compliance validation

6. **Performance Testing** (15 minutes)
   - Load time measurements
   - Bundle size analysis
   - Translation loading performance

### Total Estimated Time: 2.5 hours

## Results Compilation

### Report Generation
```typescript
async function generateTestReport(allResults) {
  const report = {
    testSuite: 'SenseiiWyze Dashboard i18n Quality Assurance',
    executionTime: new Date().toISOString(),
    summary: {
      totalTests: allResults.length,
      passed: allResults.filter(r => r.success).length,
      failed: allResults.filter(r => !r.success).length,
      localesCovered: testMatrix.locales.length,
      routesCovered: testMatrix.routes.length
    },
    detailedResults: allResults,
    recommendations: generateRecommendations(allResults)
  };
  
  // Save report
  await writeFile('test-results/chrome-mcp-report.json', JSON.stringify(report, null, 2));
  
  return report;
}

function generateRecommendations(results) {
  const recommendations = [];
  
  // Check for performance issues
  const slowPages = results.filter(r => r.test === 'performance' && r.totalLoadTime > 3000);
  if (slowPages.length > 0) {
    recommendations.push({
      category: 'Performance',
      priority: 'High',
      issue: `${slowPages.length} pages loading slowly (>3s)`,
      suggestion: 'Optimize bundle size and implement code splitting'
    });
  }
  
  // Check for accessibility issues  
  const accessibilityIssues = results.filter(r => r.test === 'accessibility-audit' && r.score < 80);
  if (accessibilityIssues.length > 0) {
    recommendations.push({
      category: 'Accessibility',
      priority: 'Medium',
      issue: `${accessibilityIssues.length} pages with accessibility score <80`,
      suggestion: 'Add missing ARIA labels and improve keyboard navigation'
    });
  }
  
  // Check for locale-specific issues
  const localeIssues = {};
  results.forEach(r => {
    if (!r.success && r.locale) {
      localeIssues[r.locale] = (localeIssues[r.locale] || 0) + 1;
    }
  });
  
  Object.entries(localeIssues).forEach(([locale, count]) => {
    if (count > 5) {
      recommendations.push({
        category: 'Internationalization',
        priority: 'High',
        issue: `${count} issues found in ${locale} locale`,
        suggestion: `Review translation completeness and locale-specific functionality for ${locale}`
      });
    }
  });
  
  return recommendations;
}
```

## Quality Criteria

### Pass/Fail Thresholds
- **Page Load Success:** 95% of all locale/route combinations
- **Performance:** Average load time <3 seconds
- **Accessibility:** Minimum score of 80/100
- **Interactive Elements:** 100% functionality across locales
- **Authentication:** 100% success rate for core flows

### Critical Issues (Auto-Fail)
- Any page completely inaccessible
- Authentication completely broken in any locale
- Data corruption or security vulnerabilities
- Complete translation system failure

---

*This workflow provides comprehensive Chrome MCP testing coverage for the SenseiiWyze Dashboard internationalization implementation.*