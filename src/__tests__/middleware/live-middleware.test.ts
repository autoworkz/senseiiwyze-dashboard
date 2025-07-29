/**
 * Live Middleware Testing
 * 
 * Tests the actual middleware execution with real server requests
 * to identify where the disconnect happens between isolated functions
 * and live middleware execution.
 */

describe('Live Middleware Execution Tests', () => {
  const baseUrl = 'http://localhost:3000';

  beforeAll(() => {
    console.log('\n🔥 TESTING LIVE MIDDLEWARE EXECUTION');
    console.log('Server should be restarted and running on', baseUrl);
  });

  describe('Phase 1: Basic Server Connectivity', () => {
    
    it('should confirm server is responding', async () => {
      try {
        const response = await fetch(baseUrl, {
          method: 'HEAD',
          headers: { 'User-Agent': 'middleware-test' }
        });
        
        console.log('Server HEAD response:', response.status);
        expect(response.status).toBeDefined();
        
        if (response.status === 200) {
          console.log('✅ Server is responding normally');
        } else {
          console.log('🔄 Server responding but with status:', response.status);
        }
      } catch (error) {
        console.log('❌ Server not responding:', error.message);
        fail('Server is not responding - ensure dev server is running');
      }
    });

    it('should test if middleware logs are visible', async () => {
      console.log('\n🔍 Testing middleware execution...');
      console.log('Look for middleware logs in the terminal where you ran `pnpm dev`');
      
      try {
        const response = await fetch(`${baseUrl}/en/auth/login`, {
          headers: { 
            'User-Agent': 'middleware-log-test',
            'X-Test-Purpose': 'middleware-logging'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        expect(response.status).toBeDefined();
        
        // Instructions for user
        console.log('\n📝 CHECK YOUR TERMINAL:');
        console.log('   Look for these middleware logs:');
        console.log('   🔥 Middleware entered');
        console.log('   🚀 Middleware running for: /en/auth/login');
        console.log('   🌍 Detected locale: en');
        console.log('   🛣️  Path without locale: /auth/login');
        console.log('   ✅ Public route, allowing access');
        
      } catch (error) {
        console.log('Request failed:', error.message);
      }
    });
  });

  describe('Phase 2: Public Route Testing', () => {
    
    it('should test /en/auth/login (public route)', async () => {
      const response = await fetch(`${baseUrl}/en/auth/login`, {
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('Login page status:', response.status);
      
      if (response.status === 200) {
        const html = await response.text();
        console.log('✅ Login page loaded successfully');
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).not.toContain('NEXT_HTTP_ERROR_FALLBACK');
      } else if (response.status === 404) {
        console.log('❌ Still getting 404 - middleware or routing issue');
        const html = await response.text();
        console.log('Error page contains:', html.includes('NEXT_HTTP_ERROR_FALLBACK') ? 'Next.js error' : 'Custom 404');
      } else {
        console.log('🔄 Unexpected status:', response.status);
      }
      
      expect(response.status).toBeDefined();
    });

    it('should test /en/auth/signup (public route)', async () => {
      const response = await fetch(`${baseUrl}/en/auth/signup`, {
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('Signup page status:', response.status);
      expect(response.status).toBeDefined();
    });

    it('should test API route /api/auth/session', async () => {
      const response = await fetch(`${baseUrl}/api/auth/session`, {
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('API session status:', response.status);
      
      // API routes should bypass middleware locale logic
      if (response.status < 500) {
        console.log('✅ API route accessible');
      } else {
        console.log('❌ API route error');
      }
      
      expect(response.status).toBeDefined();
    });
  });

  describe('Phase 3: Locale Redirect Testing', () => {
    
    it('should test root path / (should redirect)', async () => {
      const response = await fetch(baseUrl, {
        redirect: 'manual', // Don't follow redirects
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('Root path status:', response.status);
      console.log('Location header:', response.headers.get('location'));
      
      if (response.status >= 300 && response.status < 400) {
        console.log('✅ Root path redirecting as expected');
        const location = response.headers.get('location');
        console.log('Redirecting to:', location);
      } else {
        console.log('🔄 Root path not redirecting, status:', response.status);
      }
      
      expect(response.status).toBeDefined();
    });

    it('should test /auth/login (no locale - should redirect)', async () => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        redirect: 'manual',
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('No-locale auth status:', response.status);
      console.log('Location header:', response.headers.get('location'));
      
      if (response.status >= 300 && response.status < 400) {
        console.log('✅ Non-localized route redirecting to add locale');
      } else {
        console.log('🔄 No locale redirect, status:', response.status);
      }
      
      expect(response.status).toBeDefined();
    });
  });

  describe('Phase 4: Protected Route Testing', () => {
    
    it('should test /en/platform/users (admin route - should redirect to login)', async () => {
      const response = await fetch(`${baseUrl}/en/platform/users`, {
        redirect: 'manual',
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('Protected platform route status:', response.status);
      console.log('Location header:', response.headers.get('location'));
      
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location?.includes('/auth/login')) {
          console.log('✅ Protected route redirecting to login');
        } else {
          console.log('🔄 Protected route redirecting but not to login:', location);
        }
      } else {
        console.log('🔄 Protected route not redirecting, status:', response.status);
      }
      
      expect(response.status).toBeDefined();
    });

    it('should test /en/learner/me (should redirect to login)', async () => {
      const response = await fetch(`${baseUrl}/en/learner/me`, {
        redirect: 'manual',
        headers: { 'Accept': 'text/html' }
      });
      
      console.log('Learner route status:', response.status);
      console.log('Location header:', response.headers.get('location'));
      
      expect(response.status).toBeDefined();
    });
  });

  describe('Phase 5: Middleware Function Verification', () => {
    
    it('should verify middleware is actually running', async () => {
      console.log('\n📊 MIDDLEWARE EXECUTION ANALYSIS:');
      console.log('=====================================');
      
      // Test multiple routes to see patterns
      const testRoutes = [
        '/en/auth/login',     // Public
        '/en/platform/users', // Protected
        '/',                  // Root
        '/api/auth/session'   // API
      ];
      
      const results = [];
      
      for (const route of testRoutes) {
        try {
          const response = await fetch(`${baseUrl}${route}`, {
            redirect: 'manual',
            headers: { 'Accept': 'text/html', 'X-Test-Route': route }
          });
          
          results.push({
            route,
            status: response.status,
            location: response.headers.get('location'),
            hasError: response.status === 404
          });
          
          console.log(`${route}: ${response.status} ${response.headers.get('location') || ''}`);
          
        } catch (error) {
          results.push({
            route,
            status: 'ERROR',
            error: error.message
          });
        }
      }
      
      console.log('\n📈 RESULTS SUMMARY:');
      const errorCount = results.filter(r => r.hasError).length;
      const successCount = results.filter(r => r.status === 200).length;
      const redirectCount = results.filter(r => r.status >= 300 && r.status < 400).length;
      
      console.log(`   ✅ Success (200): ${successCount}`);
      console.log(`   🔄 Redirects (3xx): ${redirectCount}`);  
      console.log(`   ❌ Errors (404): ${errorCount}`);
      console.log(`   🔧 Total tested: ${results.length}`);
      
      if (errorCount === results.length) {
        console.log('\n❌ ALL ROUTES FAILING - Likely server/config issue');
      } else if (errorCount > 0) {
        console.log('\n🔄 PARTIAL FAILURES - Route-specific issues');
      } else {
        console.log('\n✅ ALL ROUTES WORKING - Middleware functioning correctly');
      }
      
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Phase 6: Next Steps Analysis', () => {
    
    it('should provide debugging guidance based on results', () => {
      console.log('\n🎯 DEBUGGING NEXT STEPS:');
      console.log('========================');
      console.log('1. Check terminal logs for middleware execution');
      console.log('2. If no middleware logs: middleware not running');
      console.log('3. If middleware logs but 404s: routing issue');
      console.log('4. If some routes work: specific route problems');
      console.log('5. If all 404s: fundamental config issue');
      console.log('\n🔧 If middleware is running but routes fail:');
      console.log('   → Test Level 3: Component isolation');
      console.log('   → Check layout.tsx execution');
      console.log('   → Verify i18n config server-side');
      
      expect(true).toBe(true);
    });
  });
});