'use client';

import { useCallback } from 'react';
import {
  useLocale as useNextIntlLocale,
} from 'next-intl';
import {
  useRouter,
  usePathname,
} from 'next/navigation';

/** Supported application locales. */
const LOCALES = ['en', 'es', 'fr', 'de', 'ja'] as const;

/** A single supported locale string. */
type Locale = (typeof LOCALES)[number];

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
      const stripped = pathname.replace(
        /^\/[a-z]{2}(?:-[A-Z]{2})?/,
        '',
      );
      router.push(`/${next}${stripped || '/'}`);
    },
    [pathname, router],
  );

  return {
    locale,
    setLocale,
    locales: LOCALES,
  };
}

export default useLocale;
