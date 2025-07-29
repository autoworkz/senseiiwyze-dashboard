/**
 * Test-Driven Development: Auth Login Route Accessibility
 * 
 * This test verifies that the /en/auth/login route:
 * 1. Returns HTTP 200 status
 * 2. Serves the login page correctly
 * 3. Contains expected login form elements
 */

import { NextRequest } from 'next/server';

// Mock the middleware for testing
jest.mock('@/middleware', () => ({
  middleware: jest.fn()
}));

describe('Auth Login Route TDD', () => {
  const baseUrl = 'http://localhost:3000';
  
  beforeAll(() => {
    // Ensure we're testing against the correct environment
    process.env.NODE_ENV = 'test';
  });

  describe('/en/auth/login route accessibility', () => {
    it('should return 200 status for GET request', async () => {
      // This test will initially fail - that's the TDD approach
      const response = await fetch(`${baseUrl}/en/auth/login`, {
        method: 'GET',
        headers: {
          'User-Agent': 'test-client'
        }
      });

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
    });

    it('should return HTML content with login form', async () => {
      const response = await fetch(`${baseUrl}/en/auth/login`);
      
      expect(response.headers.get('content-type')).toContain('text/html');
      
      const html = await response.text();
      
      // Should contain login form elements
      expect(html).toContain('login'); // Login-related content
      expect(html).toContain('email'); // Email input
      expect(html).toContain('password'); // Password input
    });

    it('should be accessible via localized path', async () => {
      // Test multiple locales
      const locales = ['en', 'es', 'fr', 'de', 'ja'];
      
      for (const locale of locales) {
        const response = await fetch(`${baseUrl}/${locale}/auth/login`);
        
        // Should not redirect to 404
        expect(response.status).not.toBe(404);
        
        // Should be accessible (200) or redirect (3xx) but not error
        expect(response.status).toBeLessThan(400);
      }
    });

    it('should not require authentication to access', async () => {
      // Login page should be accessible without session
      const response = await fetch(`${baseUrl}/en/auth/login`, {
        headers: {
          // No authorization headers
        }
      });

      // Should not redirect to login (would be circular)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('Configuration Diagnosis (TDD Deep Dive)', () => {
    it('should have all required locale message files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const locales = ['en', 'es', 'fr', 'de', 'ja'];
      const messagesDir = path.join(process.cwd(), 'src/messages');
      
      // Check directory exists
      expect(fs.existsSync(messagesDir)).toBe(true);
      
      // Check each locale file exists and is valid JSON
      locales.forEach(locale => {
        const filePath = path.join(messagesDir, `${locale}.json`);
        expect(fs.existsSync(filePath)).toBe(true);
        
        // Verify it's valid JSON
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
        
        // Verify it has required auth translations
        const messages = JSON.parse(content);
        expect(messages).toHaveProperty('auth');
        expect(messages.auth).toHaveProperty('login');
      });
    });

    it('should have proper i18n configuration', () => {
      const fs = require('fs');
      const path = require('path');
      
      const i18nPath = path.join(process.cwd(), 'src/i18n.ts');
      const content = fs.readFileSync(i18nPath, 'utf-8');
      
      // Should export locales array
      expect(content).toContain('export const locales');
      expect(content).toContain("['en', 'es', 'fr', 'de', 'ja']");
      
      // Should have getRequestConfig
      expect(content).toContain('getRequestConfig');
      expect(content).toContain('messages:');
      
      // Check for import syntax that might cause issues
      expect(content).toContain('import(`./messages/${locale}.json`)');
    });

    it('should have valid Next.js config with next-intl integration', () => {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(process.cwd(), 'next.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      
      // Should have next-intl plugin
      expect(content).toContain('createNextIntlPlugin');
      expect(content).toContain('./src/i18n.ts');
      expect(content).toContain('withNextIntl');
      
      // Should not have conflicting configurations (allowing commented code)
      expect(content).not.toContain('export default lingoCompiler.next('); // Should be commented out
    });

    it('should diagnose middleware locale handling', () => {
      const fs = require('fs');
      const path = require('path');
      
      const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      // Should import locales from i18n
      expect(content).toContain("import { locales } from '@/i18n'");
      
      // Should create intl middleware correctly
      expect(content).toContain('createMiddleware');
      expect(content).toContain('locales,');
      expect(content).toContain("defaultLocale: 'en'");
      
      // Should handle auth routes as public
      expect(content).toContain('/auth/login');
      expect(content).toContain('/auth/signup');
    });

    it('should test locale message import resolution', async () => {
      // This test verifies if the dynamic import actually works
      try {
        const enMessages = await import('../../../src/messages/en.json');
        expect(enMessages.default).toBeDefined();
        expect(enMessages.default.auth).toBeDefined();
        expect(enMessages.default.auth.login).toBe('Login');
      } catch (error) {
        // If this fails, it shows the import path issue
        fail(`Could not import en.json: ${error.message}`);
      }
    });

    it('should check for layout.tsx configuration', () => {
      const fs = require('fs');
      const path = require('path');
      
      const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
      
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, 'utf-8');
        
        // Should have proper locale handling
        expect(content).toContain('locale');
        
        // Should not have conflicting providers
        // Check for LingoProvider that might conflict
        if (content.includes('LingoProvider')) {
          console.warn('⚠️  LingoProvider found in layout - might conflict with disabled lingo compiler');
        }
      }
    });

    it('should verify app router file structure', () => {
      const fs = require('fs');
      const path = require('path');
      
      // Check critical app router files exist
      const criticalFiles = [
        'src/app/[locale]/layout.tsx',
        'src/app/[locale]/page.tsx',
        'src/app/[locale]/auth/login/page.tsx',
        'src/middleware.ts',
        'src/i18n.ts',
        'next.config.ts'
      ];
      
      criticalFiles.forEach(filePath => {
        const fullPath = path.join(process.cwd(), filePath);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('Route structure validation', () => {
    it('should follow Next.js App Router conventions', () => {
      const fs = require('fs');
      const path = require('path');
      
      const loginPagePath = path.join(process.cwd(), 'src/app/[locale]/auth/login/page.tsx');
      
      // Verify the file exists
      expect(fs.existsSync(loginPagePath)).toBe(true);
      
      // Verify it's a valid React component
      const content = fs.readFileSync(loginPagePath, 'utf-8');
      expect(content).toContain('export default');
      expect(content).toContain('LoginForm');
    });

    it('should have proper middleware configuration', () => {
      const fs = require('fs');
      const path = require('path');
      
      const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      // Should include auth routes in public routes
      expect(content).toContain('/auth/login');
      expect(content).toContain('publicRoutes');
    });
  });
});