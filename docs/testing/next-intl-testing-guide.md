# Next-intl Testing Guide

Based on research from the official next-intl documentation, this guide covers comprehensive testing approaches for our internationalization implementation.

## 🧪 Testing Approaches Overview

### 1. Unit Testing with Jest/Vitest

#### Basic Component Testing
```tsx
import {render} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import {expect, it} from 'vitest';
import messages from '../../messages/en.json';
import UserProfile from './UserProfile';

it('renders', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <UserProfile />
    </NextIntlClientProvider>
  );
});
```

#### Jest Configuration for ESM Support
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({dir: './'});

module.exports = async () => ({
  ...(await createJestConfig({
    testEnvironment: 'jsdom',
    rootDir: 'src'
  })()),
  // Handle next-intl ESM modules
  transformIgnorePatterns: ['node_modules/(?!next-intl)/']
});
```

#### Vitest Configuration for ESM Support
```tsx
// vitest.config.mts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        // Handle next-intl ESM-only bundling
        inline: ['next-intl']
      }
    }
  }
});
```

### 2. Message Validation Testing

#### Using i18n-check for Missing Keys
```bash
# Install i18n-check
npm install -g i18n-check

# Validate messages
i18n-check --source en --locales messages
```

#### Example Output
```
Found missing keys!
┌────────────────────┬───────────────────────────────┐
│ file               │ key                           │
├────────────────────┼───────────────────────────────┤
│  messages/de.json  │  NewsArticle.title            │
└────────────────────┴───────────────────────────────┘
```

#### Programmatic Message Availability Testing
```tsx
import {useTranslations} from 'next-intl';

function ComponentTest() {
  const t = useTranslations('About');
  
  // Test if message exists
  expect(t.has('title')).toBe(true);
  expect(t.has('unknown')).toBe(false);
}
```

### 3. Component Integration Testing

#### Testing with Selective Messages
```tsx
import pick from 'lodash/pick';
import {NextIntlClientProvider, useMessages} from 'next-intl';

export default function TestWrapper() {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, 'Navigation', 'Auth')}
    >
      <ComponentUnderTest />
    </NextIntlClientProvider>
  );
}
```

#### Testing Dynamic Message Rendering
```tsx
import {useTranslations, useMessages} from 'next-intl';

function DynamicMessagesTest() {
  const t = useTranslations('CompanyStats');
  const messages = useMessages();
  const keys = Object.keys(messages.CompanyStats);

  return (
    <ul>
      {keys.map((key) => (
        <li key={key} data-testid={`stat-${key}`}>
          <h2>{t(`${key}.title`)}</h2>
          <p>{t(`${key}.value`)}</p>
        </li>
      ))}
    </ul>
  );
}
```

### 4. Domain-Based Testing

#### Development Server Configuration
```bash
# Test different domains locally
PORT=3000 npm run dev  # Like `us.example.com`
PORT=3001 npm run dev  # Like `ca.example.com`
```

#### Conditional Domain Configuration
```typescript
import {defineRouting} from 'next-intl/routing';

const isDev = process.env.NODE_ENV === 'development';

export const routing = defineConfig({
  domains: [
    {
      domain: isDev ? 'localhost:3000' : 'us.example.com'
    },
    {
      domain: isDev ? 'localhost:3001' : 'ca.example.com'
    }
  ]
});
```

### 5. Date/Time Testing

#### Consistent Date Testing with Global Now
```tsx
// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  return {
    // Set fixed date for testing
    now: new Date('2024-11-14T10:36:01.516Z')
  };
});
```

#### Testing with useNow Hook
```tsx
import {useNow, useFormatter} from 'next-intl';

function DateComponentTest({date}) {
  const now = useNow();
  const format = useFormatter();

  return (
    <span suppressHydrationWarning>
      {format.relativeTime(date, now)}
    </span>
  );
}
```

### 6. Error Handling Testing

#### Testing Invalid Locale Handling
```tsx
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export default function LocaleLayout({children, params}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Component continues...
}
```

#### Testing Middleware Error Scenarios
```tsx
// Test middleware with invalid locales
const mockRequest = new NextRequest('http://localhost:3000/invalid-locale/page');
const response = await middleware(mockRequest);
expect(response.status).toBe(404);
```

### 7. TypeScript Testing

#### Type Safety Testing
```tsx
// Test type inference for message arguments
const t = useTranslations('Messages');

// Should show TypeScript errors for wrong argument types
t('message', {}); // {name: string} expected
t('dateMessage', {}); // {today: Date} expected
t('pluralMessage', {}); // {count: number} expected
```

#### Testing Global Type Augmentation
```typescript
// global.ts
import messages from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}

// Test that autocompletion works
const t = useTranslations('Hero');
t('headline'); // Should have autocompletion
```

### 8. Middleware Testing

#### Testing Custom URL Rewrites
```tsx
import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';

export default async function middleware(request: NextRequest) {
  // Test A/B testing logic
  const [, locale, ...segments] = request.nextUrl.pathname.split('/');
  
  if (locale != null && segments.join('/') === 'profile') {
    const usesNewProfile = request.cookies.get('NEW_PROFILE')?.value === 'true';
    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }
  }

  const handleI18nRouting = createMiddleware({
    locales: ['en', 'de'],
    defaultLocale: 'en'
  });
  
  return handleI18nRouting(request);
}
```

### 9. Server Components Testing

#### Testing Server-Side Translation Loading
```tsx
import {getTranslations} from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}

// Test that server component renders correctly
it('renders server component with translations', async () => {
  const component = await ServerComponent();
  expect(component).toMatchSnapshot();
});
```

### 10. RTL Language Testing

#### Testing Right-to-Left Languages
```tsx
import {getLangDir} from 'rtl-detect';
import {useLocale} from 'next-intl';

function RTLTest() {
  const locale = useLocale();
  const direction = getLangDir(locale);
  
  return (
    <div dir={direction} className={direction === 'rtl' ? 'text-right' : 'text-left'}>
      {direction === 'ltr' ? <ArrowRight /> : <ArrowLeft />}
    </div>
  );
}

// Test RTL behavior
it('renders correct direction for Arabic', () => {
  render(
    <NextIntlClientProvider locale="ar" messages={{}}>
      <RTLTest />
    </NextIntlClientProvider>
  );
  expect(screen.getByRole('container')).toHaveAttribute('dir', 'rtl');
});
```

## 🔧 Our Current Testing Implementation

### Existing Test Structure

1. **Comprehensive Configuration Audit**: `src/__tests__/i18n/next-intl-comprehensive-audit.test.ts`
2. **Middleware Isolation Tests**: `src/__tests__/middleware/middleware-isolation.test.ts`
3. **Live Middleware Tests**: `src/__tests__/middleware/live-middleware.test.ts`
4. **Manual Integration Tests**: `src/__tests__/integration/`

### Recommended Additional Tests

#### 1. Component Translation Tests
```tsx
// src/__tests__/components/hero.test.tsx
import {render, screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import {Hero229} from '@/components/hero229';
import messages from '@/messages/en.json';

describe('Hero229 Component', () => {
  it('renders all translated content', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Hero229 />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText(messages.hero.headline)).toBeInTheDocument();
    expect(screen.getByText(messages.hero.description)).toBeInTheDocument();
    expect(screen.getByText(messages.hero.getStarted)).toBeInTheDocument();
  });
  
  it('works with all supported locales', async () => {
    const locales = ['en', 'es', 'fr', 'de', 'ja'];
    
    for (const locale of locales) {
      const messages = await import(`@/messages/${locale}.json`);
      
      render(
        <NextIntlClientProvider locale={locale} messages={messages.default}>
          <Hero229 />
        </NextIntlClientProvider>
      );
      
      expect(screen.getByText(messages.default.hero.headline)).toBeInTheDocument();
    }
  });
});
```

#### 2. Message Completeness Tests
```tsx
// src/__tests__/i18n/message-completeness.test.ts
import fs from 'fs';
import path from 'path';

describe('Message Completeness', () => {
  const locales = ['en', 'es', 'fr', 'de', 'ja'];
  const messagesDir = path.join(process.cwd(), 'src/messages');
  
  it('all locales have the same message keys', () => {
    const enMessages = JSON.parse(
      fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8')
    );
    const enKeys = extractKeys(enMessages);
    
    locales.slice(1).forEach(locale => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf-8')
      );
      const keys = extractKeys(messages);
      
      expect(keys.sort()).toEqual(enKeys.sort());
    });
  });
  
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
});
```

#### 3. Form Validation with Translations Tests
```tsx
// src/__tests__/auth/login-form.test.tsx
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import {LoginForm} from '@/components/auth/login-form';
import messages from '@/messages/en.json';

describe('LoginForm Translations', () => {
  it('shows validation errors in correct language', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LoginForm />
      </NextIntlClientProvider>
    );
    
    fireEvent.click(screen.getByRole('button', {name: /login/i}));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });
});
```

#### 4. URL Generation Tests
```tsx
// src/__tests__/routing/locale-link.test.tsx
import {render, screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import {LocaleLink} from '@/components/locale-link';

describe('LocaleLink', () => {
  it('generates correct localized URLs', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={{}}>
        <LocaleLink href="/about">About</LocaleLink>
      </NextIntlClientProvider>
    );
    
    expect(screen.getByRole('link')).toHaveAttribute('href', '/fr/about');
  });
  
  it('handles external URLs correctly', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={{}}>
        <LocaleLink href="https://example.com">External</LocaleLink>
      </NextIntlClientProvider>
    );
    
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });
});
```

## 🚀 Quick Start Commands

```bash
# Run all i18n tests
pnpm test src/__tests__/i18n/

# Run component translation tests
pnpm test -- --testNamePattern="translation"

# Run middleware tests
pnpm test src/__tests__/middleware/

# Validate message files
i18n-check --source en --locales src/messages

# Test specific locale
LOCALE=fr pnpm test

# Run comprehensive audit
pnpm test src/__tests__/i18n/next-intl-comprehensive-audit.test.ts
```

## 📊 Coverage Goals

- ✅ **Configuration Testing**: 100% coverage of i18n setup
- ✅ **Middleware Testing**: Complete routing logic coverage  
- ✅ **Message File Validation**: All locales have consistent structure
- 🔄 **Component Testing**: Test all components using translations
- 🔄 **Form Validation**: Test localized error messages
- 🔄 **URL Generation**: Test all routing scenarios
- 🔄 **Date/Time Formatting**: Test across locales
- 🔄 **RTL Language Support**: Test Arabic/Hebrew layouts

This comprehensive testing approach ensures our internationalization is robust, maintainable, and provides excellent user experience across all supported locales.