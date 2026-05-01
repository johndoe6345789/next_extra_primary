/**
 * @file useKeycloakRefresh.ts
 * @brief Schedules silent refresh of the Keycloak access
 *        token a configurable lead time before expiry.
 */
import { useEffect } from 'react';
import { refresh } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie, writeCookie,
} from '@/lib/keycloakCookies';
import cfg from '@/constants/keycloak.json';

type Setter = (token: string | null) => void;

/**
 * Schedule a refresh `cfg.refreshLeadSeconds` before the
 * given expiry, persisting the new tokens in cookies.
 *
 * @param expiresAtMs - epoch ms when the token expires
 * @param setAccess - update in-memory access token
 */
export function useKeycloakRefresh(
  expiresAtMs: number | null,
  setAccess: Setter,
): void {
  useEffect(() => {
    if (!expiresAtMs) return;
    const lead = cfg.refreshLeadSeconds * 1000;
    const delay = Math.max(0, expiresAtMs - Date.now() - lead);
    const id = window.setTimeout(async () => {
      const rt = readCookie(COOKIE.refresh);
      if (!rt) return;
      try {
        const tok = await refresh(rt);
        writeCookie(
          COOKIE.access, tok.access_token, tok.expires_in,
        );
        if (tok.refresh_token) {
          writeCookie(
            COOKIE.refresh, tok.refresh_token,
            tok.refresh_expires_in ?? tok.expires_in,
          );
        }
        setAccess(tok.access_token);
      } catch {
        setAccess(null);
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [expiresAtMs, setAccess]);
}
