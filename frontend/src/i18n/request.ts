import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import type { Locale } from './config';

/**
 * Per-request i18n configuration.
 *
 * Loads the JSON message catalogue for the resolved
 * locale. Falls back to the default locale when the
 * requested locale is invalid or missing.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default as Record<
      string,
      unknown
    >,
  };
});
