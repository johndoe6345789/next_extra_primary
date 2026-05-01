'use client';

/**
 * @file page.tsx (auth/callback)
 * @brief Handles the Keycloak OIDC redirect.
 *        Exchanges `code` for tokens and lands the user
 *        on the dashboard (or `next` query param).
 */
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CircularProgress } from '@shared/m3';
import { exchangeCode } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie, writeCookie, clearCookie,
} from '@/lib/keycloakCookies';

/** Persisted state cookie shape. */
interface StateCookie { state: string; next: string }

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
    const verifier = readCookie(COOKIE.verifier) ?? '';
    const stRaw = readCookie(COOKIE.state) ?? '{}';
    let parsed: StateCookie;
    try {
      parsed = JSON.parse(stRaw) as StateCookie;
    } catch {
      parsed = { state: '', next: '' };
    }
    const fail = (reason: string): void => {
      // eslint-disable-next-line no-console
      console.error('[kc-callback] fail:', reason, {
        code: !!code, recvState,
        cookieState: parsed.state,
        hasVerifier: !!verifier,
      });
      clearCookie(COOKIE.state);
      clearCookie(COOKIE.verifier);
      router.replace(`/${locale}/login?error=oidc`);
    };
    if (!code) { fail('no code'); return; }
    if (parsed.state !== recvState) {
      fail('state mismatch'); return;
    }
    if (!verifier) { fail('no verifier'); return; }
    void (async () => {
      try {
        const tok = await exchangeCode(code, verifier);
        writeCookie(
          COOKIE.access, tok.access_token, tok.expires_in,
        );
        if (tok.refresh_token) {
          writeCookie(
            COOKIE.refresh, tok.refresh_token,
            tok.refresh_expires_in ?? tok.expires_in,
          );
        }
        clearCookie(COOKIE.state);
        clearCookie(COOKIE.verifier);
        // Strip the basePath ('/app') from next if it
        // was passed in already-prefixed form, since
        // Next.js's router.replace() will re-prefix.
        let next = parsed.next || `/${locale}/dashboard`;
        if (next.startsWith('/app/')) {
          next = next.slice(4);
        } else if (next === '/app') {
          next = '/';
        }
        router.replace(next);
      } catch (e) {
        fail('exchange failed: ' + String(e));
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
