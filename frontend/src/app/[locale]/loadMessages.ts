/**
 * Loads translation messages for a given locale.
 * Fetches from the backend translation API (Postgres).
 * @module app/[locale]/loadMessages
 */

/**
 * Fetch translation messages for the active locale.
 *
 * Loads from the backend translation API with a
 * 60-second revalidation window. Returns an empty
 * record if the API is unavailable.
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
      const data = (await res.json()) as Record<
        string, unknown
      >;
      if (Object.keys(data).length > 0) return data;
    }
  } catch {
    /* API unreachable — return empty. */
  }
  return {};
}
