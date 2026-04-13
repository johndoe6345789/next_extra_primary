/**
 * Supported application locales.
 *
 * Add new locale codes here and provide matching
 * translation JSON in `backend/seed/translations/`.
 */
export const locales = [
  'en', 'es', 'fr', 'de',
  'ja', 'zh', 'nl', 'cy',
] as const;

/** Union type of all supported locale codes. */
export type Locale = (typeof locales)[number];

/**
 * Fallback locale used when a requested locale is
 * unavailable or when no locale segment is present.
 */
export const defaultLocale: Locale = 'en';
