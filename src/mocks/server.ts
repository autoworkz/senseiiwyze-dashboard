/**
 * Mock Service Worker (MSW) Server Setup
 * 
 * Sets up MSW for Node.js-based mocking during testing.
 * Provides the same handlers as browser mocks for consistent testing.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup the server with our API handlers
export const server = setupServer(...handlers);

// Export for use in test setup
export default server;