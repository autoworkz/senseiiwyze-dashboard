/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'

describe('/sentry-example-page API Integration Tests', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  it('should return 200 status for /sentry-example-page', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    
    // Assert 200 status
    expect(response.status).toBe(200)
    expect(response.ok).toBe(true)
    
    // Check content type is HTML
    const contentType = response.headers.get('content-type')
    expect(contentType).toContain('text/html')
  })

  it('should contain expected Sentry page content', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Assert expected content exists
    expect(html).toContain('sentry-example-page') // Page title/heading
    expect(html).toContain('Throw Sample Error') // Button text
    expect(html).toContain('Sentry') // Sentry reference
    expect(html).toContain('Issues Page') // Link text
    expect(html).toContain('read our docs') // Documentation link
    
    // Verify page structure
    expect(html).toContain('<main>') // Main section
    expect(html).toContain('<button') // Error button
    expect(html).toContain('SentryExampleFrontendError') // Error class name
    expect(html).toContain('/api/sentry-example-api') // API endpoint reference
  })

  it('should have proper HTML document structure', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for HTML document structure
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html')
    expect(html).toContain('<head>')
    expect(html).toContain('<body>')
    
    // Should not be an error page
    expect(html).not.toContain('Application error')
    expect(html).not.toContain('500')
    expect(html).not.toContain('Internal Server Error')
  })

  it('should include Sentry functionality elements', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for Sentry-specific elements
    expect(html).toContain('<svg height="40" width="40"') // Sentry logo
    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(html).toContain('fill="currentcolor"')
    
    // Verify error throwing functionality
    expect(html).toContain('This error is raised on the frontend')
    expect(html).toContain('Sentry.startSpan') // Sentry span functionality
    expect(html).toContain('onClick') // Button interaction
  })

  it('should include proper styling', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for embedded CSS styles
    expect(html).toContain('<style>')
    expect(html).toContain('main {') // Main styling
    expect(html).toContain('button {') // Button styling
    expect(html).toContain('flex-direction: column') // Layout styling
    expect(html).toContain('background-color:') // Color styling
  })
})
