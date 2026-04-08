/**
 * Loads translation messages for a given locale.
 * Tries the backend API first, falls back to local
 * JSON files.
 * @module app/[locale]/loadMessages
 */

/**
 * Fetch translation messages for the active locale.
 *
 * 1. Attempts to load from the backend translation
 *    API with a 60-second revalidation window.
 * 2. Falls back to the bundled JSON file if the API
 *    is unavailable.
 * 3. Returns an empty record as a last resort.
 *
 * @param locale - The BCP 47 locale code.
 * @returns A record of translation messages.
 */
export async function loadMessages(
  locale: string,
): Promise<Record<string, unknown>> {
  try {
    const apiUrl = process.env.INTERNAL_API_URL
      ?? 'http://localhost:8080';
    const res = await fetch(
      `${apiUrl}/api/translations/${locale}`,
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      return (await res.json()) as Record<
        string, unknown
      >;
    }
    throw new Error(`API ${res.status}`);
  } catch {
    try {
      return (
        await import(`@/messages/${locale}.json`)
      ).default;
    } catch {
      return {};
    }
  }
}
