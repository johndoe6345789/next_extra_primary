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
    const fail = (): void => {
      clearCookie(COOKIE.state);
      clearCookie(COOKIE.verifier);
      router.replace(`/${locale}/login?error=oidc`);
    };
    if (!code || parsed.state !== recvState || !verifier) {
      fail();
      return;
    }
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
        const next = parsed.next
          ? parsed.next
          : `/${locale}/dashboard`;
        router.replace(next);
      } catch {
        fail();
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
