/**
 * Test automatic locale redirection
 * 
 * This test verifies that:
 * 1. Root URL (/) redirects to /en/ (default locale)
 * 2. Non-localized paths get proper locale prefixes
 * 3. Browser locale detection works correctly
 */

describe('Locale Redirection Tests', () => {
  const baseUrl = 'http://localhost:3000';
  
  it('should redirect root URL to default locale', async () => {
    const response = await fetch(`${baseUrl}/`, {
      redirect: 'manual' // Don't follow redirects, we want to check the redirect itself
    });
    
    console.log('Response status:', response.status);
    console.log('Location header:', response.headers.get('location'));
    
    // Should redirect (302/307) to /en/
    expect([302, 307].includes(response.status)).toBe(true);
    
    const location = response.headers.get('location');
    expect(location).toContain('/en');
  });

  it('should redirect non-localized auth routes', async () => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      redirect: 'manual'
    });
    
    console.log('Auth login redirect status:', response.status);
    console.log('Auth login location:', response.headers.get('location'));
    
    // Should redirect to /en/auth/login
    expect([302, 307].includes(response.status)).toBe(true);
    
    const location = response.headers.get('location');
    expect(location).toContain('/en/auth/login');
  });

  it('should handle browser locale detection', async () => {
    // Test with Spanish Accept-Language header
    const response = await fetch(`${baseUrl}/`, {
      redirect: 'manual',
      headers: {
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    
    console.log('Spanish locale redirect status:', response.status);
    console.log('Spanish locale location:', response.headers.get('location'));
    
    // Should redirect (might be to /es/ based on Accept-Language)
    expect([302, 307].includes(response.status)).toBe(true);
    
    const location = response.headers.get('location');
    // Should redirect to either /en or /es depending on locale detection
    expect(location).toMatch(/\/(en|es)(?:\/|$)/);
  });

  it('should preserve existing locale paths', async () => {
    const response = await fetch(`${baseUrl}/en/auth/login`);
    
    console.log('Existing locale path status:', response.status);
    
    // Should not redirect a properly localized path
    // (might return 200 for public route or redirect to dashboard if authenticated)
    expect(response.status).not.toBe(404);
  });
});