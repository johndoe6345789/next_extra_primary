'use client';

/**
 * @file page.tsx (auth/callback)
 * @brief Handles the Keycloak OIDC redirect.
 *
 * Two entry paths converge here:
 *
 *  1. Server-side 302 from /app/en/login (no PKCE).
 *     `state` is the original `next` URL (a path).
 *  2. Client-side login() from useKeycloak() (with
 *     PKCE). `state` is a random token persisted in
 *     the nextra_sso_state cookie alongside the
 *     PKCE verifier.
 *
 * The callback distinguishes by whether the verifier
 * cookie is present.
 */
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import {
  useRouter, useSearchParams,
} from 'next/navigation';
import { useLocale } from 'next-intl';
import { CircularProgress } from '@shared/m3';
import { exchangeCode } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie, writeCookie, clearCookie,
} from '@/lib/keycloakCookies';

interface StateCookie { state: string; next: string }

/**
 * @returns Spinner shown while exchange is in flight.
 */
export default function KeycloakCallbackPage():
ReactElement {
  const router = useRouter();
  const locale = useLocale();
  const search = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const code = search.get('code') ?? '';
    const recvState = search.get('state') ?? '';
    if (!code) {
      router.replace(`/${locale}/login?error=oidc`);
      return;
    }
    const verifier = readCookie(COOKIE.verifier) ?? '';
    const stRaw = readCookie(COOKIE.state);
    let next = recvState;
    if (verifier && stRaw) {
      let parsed: StateCookie;
      try {
        parsed = JSON.parse(stRaw) as StateCookie;
      } catch {
        parsed = { state: '', next: '' };
      }
      if (parsed.state !== recvState) {
        router.replace(`/${locale}/login?error=oidc`);
        return;
      }
      next = parsed.next || `/${locale}/dashboard`;
    }
    void (async () => {
      try {
        const tok =
          await exchangeCode(code, verifier);
        writeCookie(COOKIE.access,
          tok.access_token, tok.expires_in);
        if (tok.refresh_token) {
          writeCookie(COOKIE.refresh,
            tok.refresh_token,
            tok.refresh_expires_in
              ?? tok.expires_in);
        }
        clearCookie(COOKIE.state);
        clearCookie(COOKIE.verifier);
        let target = next || `/${locale}/dashboard`;
        if (target.startsWith('/app/')) {
          target = target.slice(4);
        } else if (target === '/app') {
          target = '/';
        }
        router.replace(target);
      } catch {
        router.replace(`/${locale}/login?error=oidc`);
      }
    })();
  }, [router, locale, search]);

  return (
    <div
      data-testid="keycloak-callback"
      role="status"
      aria-label="Completing Keycloak sign-in"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
      }}
    >
      <CircularProgress testId="kc-callback-spinner" />
    </div>
  );
}
