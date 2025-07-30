# Tests Directory

This directory contains automated tests for preventing regressions in the application.

## Sentry Example Page Tests

Tests for the `/sentry-example-page` endpoint to ensure it returns proper 200 status and expected content.

### Test Files

- **`sentry-example-page.test.ts`** - API/Unit tests using Vitest
  - Tests the HTTP response (200 status)
  - Validates HTML content and structure
  - Checks for expected Sentry functionality
  - Verifies styling and accessibility features

- **`sentry-example-page.e2e.ts`** - End-to-end tests using Playwright
  - Tests user interactions and visual elements
  - Validates responsive design
  - Tests Sentry connectivity handling
  - Checks error button functionality
  - Verifies accessibility features

### Running the Tests

#### E2E Tests (Playwright) - ✅ WORKING
```bash
# Run the Sentry example page E2E test
pnpm exec playwright test tests/sentry-example-page.e2e.ts

# Run with detailed output
pnpm exec playwright test tests/sentry-example-page.e2e.ts --reporter=list

# Run in headed mode (with browser UI) for debugging
pnpm exec playwright test tests/sentry-example-page.e2e.ts --headed

# Run all E2E tests in the project
pnpm test:e2e
```

#### API Tests (Node.js Integration) - ⚠️ Development Server Required
```bash
# Start the development server first
pnpm dev

# Then in another terminal, run a simple status check:
curl -I http://localhost:3000/sentry-example-page

# Should return: HTTP/1.1 200 OK
```

### Test Coverage

The tests cover:

1. **Basic Functionality**
   - 200 HTTP status response
   - Proper HTML document structure
   - Expected content presence

2. **Sentry Integration**
   - Sentry SVG logo display
   - Error throwing functionality
   - API endpoint references
   - Connectivity checking

3. **User Interface**
   - Responsive design
   - Button interactions
   - Link functionality
   - Styling and layout

4. **Accessibility**
   - Proper heading hierarchy
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

5. **Progressive Enhancement**
   - JavaScript disabled functionality
   - Graceful degradation

### Prerequisites

- Node.js >= 18.0.0
- Development server running on localhost:3000
- Proper Sentry configuration (for full functionality testing)

### Notes

- The API tests use `fetch` to make HTTP requests to the development server
- E2E tests automatically start the development server via Playwright configuration
- Some tests may behave differently based on Sentry connectivity and configuration
- Tests are designed to be resilient to Sentry service availability
