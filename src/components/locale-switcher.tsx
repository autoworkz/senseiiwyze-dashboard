'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales } from '@/i18n';

const localeNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
} as const;

const localeFlags = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵'
} as const;

export function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // Remove the current locale from the pathname
      const segments = pathname.split('/');
      
      // If the first segment is a locale, remove it
      if (locales.includes(segments[1] as any)) {
        segments.splice(1, 1);
      }
      
      // Create the new path with the new locale
      const newPath = `/${newLocale}${segments.join('/') || ''}`;
      
      router.push(newPath);
    });
  };

  return (
    <Select 
      value={currentLocale} 
      onValueChange={handleLocaleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[140px] h-8">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{localeFlags[currentLocale as keyof typeof localeFlags]}</span>
            <span className="text-sm">{localeNames[currentLocale as keyof typeof localeNames]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <div className="flex items-center gap-2">
              <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
              <span>{localeNames[locale as keyof typeof localeNames]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}