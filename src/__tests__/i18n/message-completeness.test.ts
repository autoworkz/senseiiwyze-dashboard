/**
 * Message Completeness Tests
 * 
 * Ensures all locale files have consistent message keys and structure.
 * This prevents missing translations from appearing in the UI.
 */

import fs from 'fs';
import path from 'path';

describe('Message Completeness', () => {
  const locales = ['en', 'es', 'fr', 'de', 'ja'];
  const messagesDir = path.join(process.cwd(), 'src/messages');
  
  // Helper function to extract all nested keys from a message object
  function extractKeys(obj: any, prefix = ''): string[] {
    return Object.keys(obj).flatMap(key => {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        return extractKeys(value, fullKey);
      }
      return [fullKey];
    });
  }

  // Helper function to extract all values (for content validation)
  function extractValues(obj: any): string[] {
    return Object.values(obj).flatMap(value => {
      if (typeof value === 'object' && value !== null) {
        return extractValues(value);
      }
      if (typeof value === 'string') {
        return [value];
      }
      return [];
    });
  }

  it('all locale files exist', () => {
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('all locale files are valid JSON', () => {
    locales.forEach(locale => {
      const filePath = path.join(messagesDir, `${locale}.json`);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  it('all locales have the same message keys', () => {
    const enMessages = JSON.parse(
      fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8')
    );
    const enKeys = extractKeys(enMessages).sort();
    
    locales.slice(1).forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const keys = extractKeys(messages).sort();
      
      // Check for missing keys
      const missingKeys = enKeys.filter(key => !keys.includes(key));
      const extraKeys = keys.filter(key => !enKeys.includes(key));
      
      if (missingKeys.length > 0) {
        console.error(`Missing keys in ${locale}.json:`, missingKeys);
      }
      
      if (extraKeys.length > 0) {
        console.error(`Extra keys in ${locale}.json:`, extraKeys);
      }
      
      expect(keys).toEqual(enKeys);
    });
  });

  it('all locales have required top-level sections', () => {
    const requiredSections = ['hero', 'auth', 'nav'];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      
      requiredSections.forEach(section => {
        expect(messages).toHaveProperty(section);
        expect(typeof messages[section]).toBe('object');
      });
    });
  });

  it('no translation contains placeholder text', () => {
    const placeholderPatterns = [
      /^TODO/i, // Only match "TODO" at the start of a string (not within words like "Ver Todo")
      /PLACEHOLDER/i,
      /\[MISSING\]/i,
      /\{UNTRANSLATED\}/i,
      /Lorem ipsum/i,
      /FIXME/i,
      /TBD/i,
    ];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const values = extractValues(messages);
      
      values.forEach(value => {
        placeholderPatterns.forEach(pattern => {
          expect(value).not.toMatch(pattern);
        });
      });
    });
  });

  it('all ICU message syntax is valid', () => {
    const icuPatterns = [
      /{[^}]+}/g, // Basic placeholders like {name}
      /{[^}]+,\s*(number|date|time|plural|select)/g, // ICU formatters
    ];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const values = extractValues(messages);
      
      values.forEach(value => {
        // Check that opening braces have closing braces
        const openBraces = (value.match(/{/g) || []).length;
        const closeBraces = (value.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);
        
        // Check for malformed ICU syntax
        const icuMatches = value.match(/{[^}]+}/g) || [];
        icuMatches.forEach(match => {
          // Should not have nested braces without proper escaping
          expect(match.slice(1, -1)).not.toMatch(/[{}]/);
        });
      });
    });
  });

  it('hero section has all required keys', () => {
    const requiredHeroKeys = [
      'readinessIndex',
      'headline', 
      'description',
      'learnMore',
      'getStarted'
    ];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      
      requiredHeroKeys.forEach(key => {
        expect(messages.hero).toHaveProperty(key);
        expect(typeof messages.hero[key]).toBe('string');
        expect(messages.hero[key].length).toBeGreaterThan(0);
      });
    });
  });

  it('auth section has all required keys', () => {
    const requiredAuthKeys = [
      'login',
      'signup',
      'email',
      'password',
      'forgotPassword',
      'signInWith',
      'createAccount',
      'alreadyHaveAccount',
      'dontHaveAccount'
    ];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      
      requiredAuthKeys.forEach(key => {
        expect(messages.auth).toHaveProperty(key);
        expect(typeof messages.auth[key]).toBe('string');
        expect(messages.auth[key].length).toBeGreaterThan(0);
      });
    });
  });

  it('nav section has all required keys', () => {
    const requiredNavKeys = [
      'dashboard',
      'settings',
      'profile',
      'logout',
      'switchRole',
      'home'
    ];
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      
      requiredNavKeys.forEach(key => {
        expect(messages.nav).toHaveProperty(key);
        expect(typeof messages.nav[key]).toBe('string');
        expect(messages.nav[key].length).toBeGreaterThan(0);
      });
    });
  });

  it('no empty translation strings', () => {
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const values = extractValues(messages);
      
      values.forEach(value => {
        expect(value.trim()).not.toBe('');
      });
    });
  });

  it('translation keys follow consistent naming convention', () => {
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const keys = extractKeys(messages);
      
      keys.forEach(key => {
        // Keys should use camelCase
        expect(key).toMatch(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/);
      });
    });
  });

  it('provides helpful summary of message statistics', () => {
    console.log('\n=== MESSAGE STATISTICS ===');
    
    locales.forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const keys = extractKeys(messages);
      const values = extractValues(messages);
      const totalChars = values.join('').length;
      
      console.log(`${locale.toUpperCase()}:`);
      console.log(`  - Keys: ${keys.length}`);
      console.log(`  - Total characters: ${totalChars}`);
      console.log(`  - Average per message: ${Math.round(totalChars / values.length)}`);
    });
    
    // Always pass - this is informational
    expect(true).toBe(true);
  });
});