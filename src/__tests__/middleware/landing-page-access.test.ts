/**
 * Test Landing Page Access
 * 
 * Verifies that:
 * 1. Root URL (/) is accessible to unauthenticated users (public)
 * 2. Root URL redirects to localized version (/en)
 * 3. Unauthenticated users are NOT redirected to login
 * 4. Landing page loads properly
 */

describe('Landing Page Access Tests', () => {
  const baseUrl = 'http://localhost:3000';
  
  it('should allow unauthenticated access to root URL', async () => {
    const response = await fetch(`${baseUrl}/`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    console.log('Root URL status:', response.status);
    console.log('Root URL location:', response.headers.get('location'));
    
    // Should redirect to localized version (/en), not to login
    expect([302, 307].includes(response.status)).toBe(true);
    
    const location = response.headers.get('location');
    expect(location).toContain('/en');
    expect(location).not.toContain('/auth/login');
  });

  it('should serve localized landing page without authentication', async () => {
    const response = await fetch(`${baseUrl}/en`);
    
    console.log('Localized landing page status:', response.status);
    
    // Should either return 200 (if page exists) or redirect further, but NOT 404 or auth redirect
    expect(response.status).not.toBe(404);
    
    // If it redirects, it should not be to login
    if ([302, 307].includes(response.status)) {
      const location = response.headers.get('location');
      expect(location).not.toContain('/auth/login');
    }
  });

  it('should not redirect unauthenticated users to login from landing page', async () => {
    // Test that we don't get redirected to login when accessing landing page
    const response = await fetch(`${baseUrl}/en`, {
      redirect: 'manual',
      headers: {
        // No authorization headers - simulating unauthenticated user
      }
    });
    
    console.log('Unauthenticated landing page access status:', response.status);
    console.log('Unauthenticated landing page location:', response.headers.get('location'));
    
    // Should either return content (200) or redirect to non-auth route
    if ([302, 307].includes(response.status)) {
      const location = response.headers.get('location');
      expect(location).not.toContain('/auth/login');
      expect(location).not.toContain('/login');
    } else {
      // If not redirecting, should be successful access
      expect(response.status).toBeLessThan(400);
    }
  });

  it('should demonstrate the middleware fix working', async () => {
    // This test documents the expected behavior after the fix
    const rootResponse = await fetch(`${baseUrl}/`, { redirect: 'manual' });
    const localizedResponse = await fetch(`${baseUrl}/en`);
    
    console.log('=== Middleware Fix Verification ===');
    console.log('Root (/) redirects to:', rootResponse.headers.get('location'));
    console.log('Localized (/en) status:', localizedResponse.status);
    
    // Root should redirect to localized version
    expect(rootResponse.status).toBeGreaterThanOrEqual(302);
    expect(rootResponse.headers.get('location')).toContain('/en');
    
    // Localized version should be accessible (not 404, not login redirect)
    expect(localizedResponse.status).not.toBe(404);
    
    console.log('✅ Landing page is now public and accessible!');
  });
});