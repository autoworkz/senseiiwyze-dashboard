/**
 * Vitest Setup Configuration
 * 
 * Global setup for Vitest testing environment with Next.js and next-intl support.
 * Provides debugging-friendly configuration and proper mocking.
 */

import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { server } from '@/mocks/server';

// Jest compatibility layer - make Vitest APIs available as Jest globals
(globalThis as any).jest = {
  fn: vi.fn,
  mock: vi.mock,
  unmock: vi.unmock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  clearAllTimers: vi.clearAllTimers,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  spyOn: vi.spyOn,
};

// Mock function types for better compatibility
type MockFunction<T = any, Y extends any[] = any[]> = {
  (...args: Y): T;
  mockImplementation: (fn: (...args: Y) => T) => MockFunction<T, Y>;
  mockResolvedValue: (value: T) => MockFunction<T, Y>;
  mockRejectedValue: (value: any) => MockFunction<T, Y>;
  mockReturnValue: (value: T) => MockFunction<T, Y>;
};

// Global mock function creator - removed as types can't be assigned as values

// Add fail function for tests
(globalThis as any).fail = (message?: string) => {
  throw new Error(message || 'Test failed');
};

// Helper function for safe error message extraction
(globalThis as any).getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
};

// Helper function for safe error name extraction
(globalThis as any).getErrorName = (error: unknown): string => {
  if (error instanceof Error) {
    return error.name;
  }
  return 'Error';
};

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

// Mock environment variables (safely)
// Note: NODE_ENV is read-only in Node.js, so we use Object.defineProperty for testing
if (typeof process.env.NODE_ENV === 'undefined') {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: false,
    enumerable: true,
    configurable: true
  });
}

// Set other environment variables for testing
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
  // Start MSW server before all tests, but allow bypass for localhost requests
  server.listen({ 
    onUnhandledRequest: (req) => {
      // Allow real requests to localhost (dev server)
      if (req.url.includes('localhost:3000')) {
        return 'bypass'
      }
      return 'error'
    }
  });
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