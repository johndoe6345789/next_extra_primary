/**
 * @file keycloakCookies.ts
 * @brief Browser cookie helpers for Keycloak tokens.
 *        Uses document.cookie (not HttpOnly) because
 *        the access token must be readable by the SPA.
 */
import cfg from '@/constants/keycloak.json';

const NAMES = cfg.cookies;

/**
 * Read a cookie by name on the client.
 *
 * @param name - cookie name
 * @returns decoded value or null
 */
export function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split('; ');
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq < 0) continue;
    if (p.slice(0, eq) === name) {
      return decodeURIComponent(p.slice(eq + 1));
    }
  }
  return null;
}

/**
 * Write a cookie with sane defaults.
 *
 * @param name - cookie name
 * @param value - cookie value
 * @param maxAgeSeconds - max-age in seconds
 */
export function writeCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
): void {
  if (typeof document === 'undefined') return;
  const v = encodeURIComponent(value);
  document.cookie =
    `${name}=${v}; path=/; max-age=${maxAgeSeconds};`
    + ' SameSite=Lax';
}

/** Delete a cookie by name. */
export function clearCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie =
    `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/** Keycloak cookie names from constants/keycloak.json. */
export const COOKIE = NAMES;
