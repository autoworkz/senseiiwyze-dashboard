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

export default withNextIntl(nextConfig);

