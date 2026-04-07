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
 * (backed by PostgreSQL). Falls back to static
 * JSON files when the API is unreachable.
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
      messages = (await res.json()) as Record<
        string, unknown
      >;
    } else {
      throw new Error(`API ${res.status}`);
    }
  } catch {
    messages = (
      await import(`../messages/${locale}.json`)
    ).default as Record<string, unknown>;
  }

  return { locale, messages };
});
