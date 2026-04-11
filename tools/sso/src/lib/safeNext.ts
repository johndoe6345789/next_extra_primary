/**
 * @file safeNext.ts
 * @brief Sanitises the `next` redirect parameter
 * so only same-host paths are ever followed.
 */

/** Only plain same-host paths are allowed. */
const SAFE_PATHS = /^\/[a-zA-Z0-9/_?=&%-]*$/;

/**
 * Return `raw` if it is a safe same-host path,
 * otherwise return the fallback `/`.
 *
 * @param raw - Untrusted value from searchParams.
 * @returns A validated redirect path.
 */
export function safeNext(
  raw: string | undefined,
): string {
  if (raw && SAFE_PATHS.test(raw)) return raw;
  return '/';
}
