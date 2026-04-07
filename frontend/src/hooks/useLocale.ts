'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLocale as useNextIntlLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  locales as fallbackLocales, type Locale,
} from '@/i18n/config';
import { useGetLocalesQuery } from
  '@/store/api/translationApi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '@/store/api/preferencesApi';

/** Return type for the useLocale hook. */
interface UseLocaleReturn {
  /** The currently active locale. */
  locale: string;
  /** Navigate to a new locale. */
  setLocale: (locale: Locale) => void;
  /** All supported locale strings. */
  locales: readonly string[];
}

/**
 * Manages the active locale. Syncs preference
 * with the backend when the user is logged in.
 *
 * @returns Locale state and controls.
 */
export function useLocale(): UseLocaleReturn {
  const locale = useNextIntlLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useGetLocalesQuery();
  const applied = useRef(false);

  const loggedIn = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );
  const { data: prefs } = useGetPreferencesQuery(
    undefined, { skip: !loggedIn },
  );
  const [savePref] =
    useUpdatePreferencesMutation();

  const locales: readonly string[] =
    data?.locales ?? fallbackLocales;

  /* Apply saved locale on login (once). */
  useEffect(() => {
    if (
      prefs?.locale
      && prefs.locale !== locale
      && !applied.current
    ) {
      applied.current = true;
      router.push(pathname, {
        locale: prefs.locale as Locale,
      });
    }
  }, [prefs?.locale, locale, pathname, router]);

  const setLocale = useCallback(
    (next: Locale) => {
      router.push(pathname, { locale: next });
      if (loggedIn) savePref({ locale: next });
    },
    [pathname, router, loggedIn, savePref],
  );

  return { locale, setLocale, locales };
}

export default useLocale;
