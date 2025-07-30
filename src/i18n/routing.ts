import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es', 'fr', 'de', 'ja'],
  
  // The default locale
  defaultLocale: 'en',
  
  // Always show locale prefix (required for our multi-stakeholder setup)
  localePrefix: 'always'
});