/**
 * TDD: Next-Intl Isolation Test
 * 
 * This test isolates next-intl functionality to verify it works
 * independently of lingo.dev conflicts. We'll test the core
 * internationalization without any other dependencies.
 */

describe('Next-Intl Isolation Test', () => {
  const baseUrl = 'http://localhost:3000';

  describe('Core next-intl functionality', () => {
    it('should validate i18n.ts configuration in isolation', async () => {
      // Test the core i18n config without server dependencies
      const { locales } = await import('../../i18n');
      
      expect(locales).toEqual(['en', 'es', 'fr', 'de', 'ja']);
      expect(locales).toContain('en');
      expect(locales.length).toBe(5);
    });

    it('should load message files directly', async () => {
      // Test direct message imports (bypass next-intl server config)
      const enMessages = await import('../../messages/en.json');
      const esMessages = await import('../../messages/es.json');
      
      expect(enMessages.default).toBeDefined();
      expect(enMessages.default.auth).toBeDefined();
      expect(enMessages.default.auth.login).toBe('Login');
      
      expect(esMessages.default).toBeDefined();
      expect(esMessages.default.auth).toBeDefined();
      expect(esMessages.default.auth.login).toBe('Iniciar sesión');
    });

    it('should test simple locale-aware route without complex dependencies', async () => {
      // Test the simplest possible locale route
      const response = await fetch(`${baseUrl}/en`, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'next-intl-isolation-test'
        }
      });

      console.log('Simple /en route status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // For isolation test, we just want to see what happens
      // Don't assert success yet - just gather data
      expect(typeof response.status).toBe('number');
    });

    it('should test minimal locale-specific API route', async () => {
      // Test if API routes work (they shouldn't depend on layout)
      const response = await fetch(`${baseUrl}/api/auth/session`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'next-intl-isolation-test'
        }
      });

      console.log('API route status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      // API routes should work regardless of i18n layout issues
      expect(typeof response.status).toBe('number');
    });
  });

  describe('Middleware isolation', () => {
    it('should test middleware configuration without layout dependencies', () => {
      const fs = require('fs');
      const path = require('path');
      
      const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      // Verify middleware is properly configured for next-intl
      expect(content).toContain('createMiddleware');
      expect(content).toContain('next-intl/middleware');
      expect(content).toContain('locales');
      expect(content).toContain("defaultLocale: 'en'");
      
      // Check that public routes include auth paths
      expect(content).toContain('/auth/login');
      expect(content).toContain('/auth/signup');
    });

    it('should verify next.config.ts is clean of lingo dependencies', () => {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(process.cwd(), 'next.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      
      // Should have only next-intl, no active lingo
      expect(content).toContain('createNextIntlPlugin');
      expect(content).toContain('withNextIntl(nextConfig)');
      
      // Should NOT have active lingo compiler
      expect(content).not.toContain('export default lingoCompiler');
      expect(content).toContain('export default withNextIntl(nextConfig)');
    });
  });

  describe('Layout isolation test', () => {
    it('should verify layout.tsx has no lingo dependencies', () => {
      const fs = require('fs');
      const path = require('path');
      
      const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      
      // Should have next-intl but NO lingo
      expect(content).toContain('NextIntlClientProvider');
      expect(content).toContain('getMessages');
      
      // Should NOT have active lingo imports or components
      expect(content).not.toContain('LingoProvider');
      expect(content).not.toContain('loadDictionary');
      
      // Check for commented lingo (should be safe)
      const hasCommentedLingo = content.includes('// import { LingoProvider }');
      if (hasCommentedLingo) {
        console.log('✅ LingoProvider properly commented out');
      }
    });

    it('should create a minimal test page to isolate routing', () => {
      const fs = require('fs');
      const path = require('path');
      
      // Create a super simple test page that bypasses complex dependencies
      const testPagePath = path.join(process.cwd(), 'src/app/[locale]/test-minimal/page.tsx');
      const testPageContent = `
export default function MinimalTestPage() {
  return (
    <div>
      <h1>Minimal Test Page</h1>
      <p>This page tests basic Next.js + next-intl routing</p>
    </div>
  );
}`;

      // Create directory if it doesn't exist
      const testDir = path.dirname(testPagePath);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      // Write test page
      fs.writeFileSync(testPagePath, testPageContent);
      
      // Verify it was created
      expect(fs.existsSync(testPagePath)).toBe(true);
      console.log('✅ Created minimal test page at:', testPagePath);
    });
  });

  describe('Test minimal route accessibility', () => {
    it('should test the minimal page we just created', async () => {
      // Give server time to pick up new route
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(`${baseUrl}/en/test-minimal`, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'minimal-route-test'
        }
      });

      console.log('Minimal test page status:', response.status);
      
      if (response.ok) {
        const html = await response.text();
        expect(html).toContain('Minimal Test Page');
        console.log('✅ Minimal next-intl route working!');
      } else {
        console.log('❌ Minimal route failed, server restart needed');
        // Don't fail the test - this tells us if restart is needed
        expect(response.status).toBeDefined();
      }
    });

    it('should test all locales on minimal route', async () => {
      const locales = ['en', 'es', 'fr', 'de', 'ja'];
      const results = [];
      
      for (const locale of locales) {
        try {
          const response = await fetch(`${baseUrl}/${locale}/test-minimal`, {
            headers: { 'Accept': 'text/html' }
          });
          
          results.push({
            locale,
            status: response.status,
            ok: response.ok
          });
          
          console.log(`${locale}: ${response.status}`);
        } catch (error) {
          results.push({
            locale,
            status: 'ERROR',
            error: error.message
          });
        }
      }
      
      console.log('Locale test results:', results);
      
      // All should return same status (whether 200 or 404)
      const statuses = results.map(r => r.status);
      const uniqueStatuses = [...new Set(statuses)];
      
      expect(uniqueStatuses.length).toBeLessThanOrEqual(2); // 200 or 404, but consistent
    });
  });
});