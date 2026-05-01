/**
 * @file keycloakPkce.ts
 * @brief PKCE helpers using Web Crypto.
 */

/**
 * Base64URL-encode an ArrayBuffer.
 *
 * @param buf - bytes to encode
 * @returns base64url string (no padding)
 */
export function base64UrlEncode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 1) {
    s += String.fromCharCode(bytes[i]);
  }
  return btoa(s)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Cryptographically random URL-safe string.
 *
 * @param bytes - byte length of random source
 * @returns base64url string
 */
export function randomString(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr.buffer);
}

/**
 * Compute the SHA-256 PKCE code challenge.
 *
 * @param verifier - PKCE code verifier
 * @returns base64url-encoded SHA-256 hash
 */
export async function codeChallengeFromVerifier(
  verifier: string,
): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest(
    'SHA-256', data,
  );
  return base64UrlEncode(digest);
}
