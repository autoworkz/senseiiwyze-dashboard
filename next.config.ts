import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import lingoCompiler from "lingo.dev/compiler";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  turbopack: {

  },
  experimental: {
    // nodeMiddleware: true,
  },
  /* config options here */

};
export default lingoCompiler.next({
  turbopack: {
    enabled: "auto",
  },
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "it", "pt", "nl", "sv"],
  models: {
    "*:*": "groq:qwen/qwen3-32b",
  },
  rsc: true,
  debug: true,
  useDirective: true,

})(withNextIntl(nextConfig));

