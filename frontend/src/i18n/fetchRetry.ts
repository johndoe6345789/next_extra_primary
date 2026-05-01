/**
 * Server-side fetch with exponential-backoff retry,
 * mirroring the RTK retry policy on the client. Used
 * by the i18n request config and any other server-side
 * fetches that need to ride out a container-rebuild
 * window without rendering an empty page.
 *
 * Retries on:
 *   - thrown fetch errors (network failure)
 *   - 5xx HTTP responses
 * Does NOT retry on 4xx — those are deterministic.
 *
 * @module i18n/fetchRetry
 */

const MAX = 4;
const BASE_MS = 200;
const CAP_MS = 2000;

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

const backoffMs = (attempt: number): number => {
  const base = Math.min(
    CAP_MS, BASE_MS * 2 ** (attempt - 1),
  );
  const jitter = base * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(base + jitter));
};

/**
 * fetch() that retries 5xx and network errors with
 * exponential backoff. Returns the final Response (which
 * may be a 5xx if all attempts failed) or throws if every
 * attempt threw.
 */
export async function fetchWithRetry(
  input: string, init?: RequestInit,
): Promise<Response> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok || res.status < 500) return res;
      // 5xx → retry
      if (attempt < MAX) await sleep(backoffMs(attempt));
      else return res;
    } catch (e) {
      lastErr = e;
      if (attempt < MAX) await sleep(backoffMs(attempt));
    }
  }
  throw lastErr ?? new Error('fetchWithRetry exhausted');
}
