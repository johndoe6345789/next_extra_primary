/**
 * @file reauthViaKeycloak.ts
 * @brief Silent re-auth helper that uses the Keycloak
 *        refresh-token grant when a refresh token cookie
 *        is present.
 */
import type {
  BaseQueryFn, FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { refresh, parseJwt } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie, writeCookie, clearCookie,
} from '@/lib/keycloakCookies';
import { setCredentials } from '../slices/authSlice';
import type { User } from '../../types/auth';

type Api = Parameters<BaseQueryFn>[1];

/**
 * Try to refresh via Keycloak. On success: persist new
 * tokens in cookies and dispatch setCredentials.
 *
 * @param api - RTK Query api object for dispatch
 */
export async function reauthViaKeycloak(
  api: Api,
): Promise<boolean> {
  const rt = readCookie(COOKIE.refresh);
  if (!rt) return false;
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
    const c = parseJwt(tok.access_token);
    const roles = c?.realm_access?.roles ?? [];
    const role: User['role'] = roles.includes('admin')
      ? 'admin' : roles.includes('moderator')
        ? 'moderator' : 'user';
    const now = new Date().toISOString();
    const user: User = {
      id: c?.sub ?? '',
      email: c?.email ?? '',
      username: c?.preferred_username ?? '',
      displayName: c?.name ?? c?.preferred_username ?? '',
      role,
      createdAt: now,
      updatedAt: now,
    };
    api.dispatch(setCredentials({
      user, accessToken: tok.access_token,
    }));
    return true;
  } catch {
    clearCookie(COOKIE.access);
    clearCookie(COOKIE.refresh);
    return false;
  }
}

export type { FetchBaseQueryError };
