'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  
  // If href already includes a locale or is an external URL, use as-is
  if (href.startsWith('http') || href.startsWith('/api') || href.startsWith(`/${locale}`)) {
    return <Link href={href} {...rest} />;
  }
  
  // Add locale prefix to internal routes
  const localizedHref = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
  
  return <Link href={localizedHref} {...rest} />;
}