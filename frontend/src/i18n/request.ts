import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';
import { routing } from './routing';
import type { Locale } from './config';

/** Humanise a missing key into a fallback label. */
function fallbackLabel(key: string): string {
  const last = key.split('.').pop() ?? key;
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

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

  return {
    locale,
    messages,
    // A default timeZone is required so date/number
    // formatters produce identical markup on the server
    // (UTC in the container) and on the client (the
    // user's local zone). Without it, hydration mismatches
    // abort the whole tree and the page stays a static SSR
    // snapshot.
    timeZone: 'UTC',
    onError(err) {
      if (err.code === IntlErrorCode.MISSING_MESSAGE) return;
      console.error(err);
    },
    getMessageFallback({ key }) {
      return fallbackLabel(key);
    },
  };
});
