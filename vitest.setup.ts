/**
 * Vitest Setup Configuration
 * 
 * Global setup for Vitest testing environment with Next.js and next-intl support.
 * Provides debugging-friendly configuration and proper mocking.
 */

import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { server } from '@/mocks/server';

// Mock Next.js navigation functions
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Mock next-intl server functions (these run server-side only)
vi.mock('next-intl/server', () => ({
  getRequestConfig: vi.fn(),
  notFound: vi.fn(),
  getTranslations: vi.fn(() => (key: string) => key),
  getLocale: vi.fn(() => 'en'),
  getNow: vi.fn(() => new Date()),
  getTimeZone: vi.fn(() => 'UTC'),
}));

// Mock next-intl client functions
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
  useNow: vi.fn(() => new Date()),
  useTimeZone: vi.fn(() => 'UTC'),
  useMessages: vi.fn(() => ({})),
}));

// Mock Better Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Global test utilities (only in browser-like environments)
if (typeof globalThis.window !== 'undefined' || typeof global.window !== 'undefined') {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock matchMedia (only in browser-like environments)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Console setup for better debugging
const originalError = console.error;
console.error = (...args) => {
  // Filter out specific warnings we don't care about in tests
  const message = args[0];
  if (typeof message === 'string' && (
    message.includes('Warning: ReactDOM.render is deprecated') ||
    message.includes('Warning: validateDOMNesting')
  )) {
    return;
  }
  originalError.call(console, ...args);
};

// Setup debugging helpers
if (process.env.VITEST_DEBUG) {
  console.log('🐛 Vitest debugging mode enabled');
  
  // Extended timeout for debugging
  vi.setConfig({
    testTimeout: 60000,
    hookTimeout: 60000,
  });
}

// Setup Mock Service Worker for API testing
beforeAll(() => {
  // Start MSW server before all tests
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers();
});

afterAll(() => {
  // Close MSW server after all tests
  server.close();
});

// Export debugging utilities
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.VITEST_DEBUG) {
      console.log(`🔍 [DEBUG] ${message}`, data || '');
    }
  },
  breakpoint: () => {
    if (process.env.VITEST_DEBUG) {
      debugger; // This will pause execution when debugging
    }
  },
};