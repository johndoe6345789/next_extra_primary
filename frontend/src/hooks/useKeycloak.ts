/**
 * @file useKeycloak.ts
 * @brief React hook exposing the Keycloak session state
 *        and login/logout actions.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  buildAuthUrl, logout as logoutUrl, parseJwt,
} from '@/lib/keycloakClient';
import type { KeycloakJwtPayload } from '@/lib/keycloakTypes';
import {
  COOKIE, readCookie, writeCookie, clearCookie,
} from '@/lib/keycloakCookies';
import {
  randomString, codeChallengeFromVerifier,
} from '@/lib/keycloakPkce';
import { useKeycloakRefresh } from './useKeycloakRefresh';

interface KeycloakState {
  user: KeycloakJwtPayload | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (next?: string) => Promise<void>;
  logout: () => void;
}

/**
 * Read the current access token from cookie + parse it.
 */
export function useKeycloak(): KeycloakState {
  const [accessToken, setAccessToken] =
    useState<string | null>(null);
  const [user, setUser] =
    useState<KeycloakJwtPayload | null>(null);

  useEffect(() => {
    const tok = readCookie(COOKIE.access);
    if (!tok) return;
    setAccessToken(tok);
    setUser(parseJwt(tok));
  }, []);

  useEffect(() => {
    if (!accessToken) { setUser(null); return; }
    setUser(parseJwt(accessToken));
  }, [accessToken]);

  const expiresAtMs =
    user?.exp ? user.exp * 1000 : null;
  useKeycloakRefresh(expiresAtMs, setAccessToken);

  const login = useCallback(async (next?: string) => {
    const verifier = randomString(32);
    const challenge =
      await codeChallengeFromVerifier(verifier);
    const state = randomString(16);
    writeCookie(COOKIE.verifier, verifier, 600);
    writeCookie(
      COOKIE.state,
      JSON.stringify({ state, next: next ?? '' }),
      600,
    );
    window.location.href =
      buildAuthUrl(state, verifier, challenge);
  }, []);

  const doLogout = useCallback(() => {
    clearCookie(COOKIE.access);
    clearCookie(COOKIE.refresh);
    setAccessToken(null);
    window.location.href = logoutUrl();
  }, []);

  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout: doLogout,
  };
}
