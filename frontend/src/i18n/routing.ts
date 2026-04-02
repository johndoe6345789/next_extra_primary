import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

/**
 * Routing configuration for next-intl.
 *
 * - `locales`: all supported language codes
 * - `defaultLocale`: fallback when none is detected
 * - `localePrefix`: 'as-needed' omits the prefix for
 *   the default locale (e.g. `/` instead of `/en`)
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});
