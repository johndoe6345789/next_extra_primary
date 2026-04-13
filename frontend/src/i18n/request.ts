import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import type { Locale } from './config';

/** Internal API URL for server-side fetching. */
const API_URL =
  process.env.INTERNAL_API_URL ??
  'http://localhost:8080';

/**
 * Per-request i18n configuration.
 *
 * Fetches translations from the C++ backend API
 * (backed by PostgreSQL).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale: Locale = routing.locales.includes(
    requested as Locale,
  )
    ? (requested as Locale)
    : routing.defaultLocale;

  let messages: Record<string, unknown> = {};
  try {
    const res = await fetch(
      `${API_URL}/api/translations/${locale}`,
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      const data = (await res.json()) as Record<
        string, unknown
      >;
      if (Object.keys(data).length > 0) {
        messages = data;
      }
    }
  } catch {
    /* API unreachable — messages stay empty. */
  }

  return { locale, messages };
});
