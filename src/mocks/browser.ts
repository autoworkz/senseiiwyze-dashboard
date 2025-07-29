/**
 * Mock Service Worker (MSW) Browser Setup
 * 
 * Sets up MSW for browser-based mocking during development.
 * Only runs in development mode to provide realistic API responses.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup the worker with our API handlers
export const worker = setupWorker(...handlers);

// Start the worker in development
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}