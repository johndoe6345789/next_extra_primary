'use client';

import { useCallback } from 'react';
import { useLocale as useNextIntlLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';

/** Return type for the useLocale hook. */
interface UseLocaleReturn {
  /** The currently active locale. */
  locale: string;
  /** Navigate to the current path with a new locale. */
  setLocale: (locale: Locale) => void;
  /** All supported locale strings. */
  locales: readonly string[];
}

/**
 * Manages the active locale. Reads the current locale
 * from next-intl and provides a setter that navigates
 * to the same path under a different locale prefix.
 *
 * @returns Locale state and controls.
 */
export function useLocale(): UseLocaleReturn {
  const locale = useNextIntlLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (next: Locale) => {
      router.push(pathname, { locale: next });
    },
    [pathname, router],
  );

  return {
    locale,
    setLocale,
    locales,
  };
}

export default useLocale;
