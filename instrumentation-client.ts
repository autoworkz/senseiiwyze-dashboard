// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7218d97bc70c3a07f79e5d88c5648ee4@o4508307182256128.ingest.us.sentry.io/4509752279695360",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Session Replay configuration for screen recording
  replaysSessionSampleRate: 0.1, // Capture 10% of all sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Configure which environments to capture data for
  environment: process.env.NODE_ENV,

  // Additional options for session replay
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content for privacy (can be customized)
      maskAllText: false,
      // Block certain elements from being recorded
      blockAllMedia: false,
      // Mask sensitive form inputs
      maskAllInputs: true,
    }),
  ],
});