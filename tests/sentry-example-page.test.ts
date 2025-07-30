import { describe, it, expect, vi } from 'vitest'

// Simple Node.js fetch implementation for API testing
const nodeFetch = require('cross-fetch')

describe('/sentry-example-page API tests', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  
  // Skip if dev server is not running (for CI/CD)
  const skipIfServerDown = async () => {
    try {
      await nodeFetch(`${baseUrl}/`)
      return false
    } catch {
      return true
    }
  }

  it('should return 200 status and expected content', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    
    // Assert 200 status
    expect(response.status).toBe(200)
    expect(response.ok).toBe(true)
    
    // Check content type
    expect(response.headers.get('content-type')).toContain('text/html')
    
    // Get the HTML content
    const html = await response.text()
    
    // Assert expected content exists
    expect(html).toContain('sentry-example-page') // Page title
    expect(html).toContain('Throw Sample Error') // Button text
    expect(html).toContain('Sentry') // Sentry reference
    expect(html).toContain('Issues Page') // Link text
    expect(html).toContain('read our docs') // Documentation link
    
    // Verify the page structure contains required elements
    expect(html).toContain('<main>') // Main section
    expect(html).toContain('<button') // Error button
    expect(html).toContain('SentryExampleFrontendError') // Error class name in script
    expect(html).toContain('/api/sentry-example-api') // API endpoint reference
  })

  it('should have proper HTML structure', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for HTML document structure
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html')
    expect(html).toContain('<head>')
    expect(html).toContain('<body>')
    
    // Check for meta tags
    expect(html).toContain('<title>')
    expect(html).toContain('meta name="description"')
    
    // Verify the page is properly rendered (not just server error page)
    expect(html).not.toContain('Application error')
    expect(html).not.toContain('500')
    expect(html).not.toContain('Internal Server Error')
  })

  it('should include Sentry SVG logo', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for SVG element with expected dimensions
    expect(html).toContain('<svg height="40" width="40"')
    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(html).toContain('fill="currentcolor"') // Sentry logo color
  })

  it('should include error throwing functionality', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Verify the error throwing functionality is present
    expect(html).toContain('SentryExampleFrontendError')
    expect(html).toContain('This error is raised on the frontend')
    expect(html).toContain('onClick') // Button has onClick handler
    expect(html).toContain('Sentry.startSpan') // Sentry span functionality
  })

  it('should have proper styling', async () => {
    const response = await fetch(`${baseUrl}/sentry-example-page`)
    const html = await response.text()
    
    // Check for CSS styles
    expect(html).toContain('<style>')
    expect(html).toContain('main {') // Main styling
    expect(html).toContain('button {') // Button styling  
    expect(html).toContain('flex-direction: column') // Layout styling
    expect(html).toContain('background-color:') // Color styling
  })
})
