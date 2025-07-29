import {withSentryConfig} from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
// import lingoCompiler from "lingo.dev/compiler"; // Disabled for build performance

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  turbopack: {

  },
  experimental: {
    // nodeMiddleware: true,
  },
  /* config options here */

};

// Lingo compiler disabled for build performance
// export default lingoCompiler.next({
//   turbopack: {
//     enabled: "auto",
//   },
//   sourceLocale: "en",
//   targetLocales: ["es", "fr", "de", "it", "pt", "nl", "sv"],
//   models: {
//     "*:*": "groq:qwen/qwen3-32b",
//   },
//   rsc: true,
//   debug: true,
//   useDirective: true,
// })(withNextIntl(nextConfig));

export default withSentryConfig(withNextIntl(nextConfig), {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "kevin-hill",
project: "senseiiwyze-next",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});