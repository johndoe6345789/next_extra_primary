/**
 * @file reauthViaCookie.ts
 * @brief Silent re-auth helper using the HttpOnly
 *        SSO cookie when no refresh token is held
 *        in Redux state (cookie-only auth model).
 */
import type {
  BaseQueryFn,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { setCredentials } from '../slices/authSlice';
import { rawBaseQuery } from './rawBaseQuery';
import type { User } from '../../types/auth';

type Api   = Parameters<BaseQueryFn>[1];
type Extra = Parameters<BaseQueryFn>[2];

/**
 * Calls GET /auth/sso-session to get a fresh access
 * token from the HttpOnly cookie.  Dispatches
 * setCredentials on success.
 *
 * @param api   RTK Query API object for dispatch.
 * @param extra RTK Query extra argument.
 * @returns True if re-auth succeeded.
 */
export async function reauthViaCookie(
  api: Api,
  extra: Extra,
): Promise<boolean> {
  const rr = await rawBaseQuery(
    {
      url: '/auth/sso-session',
      method: 'GET',
      credentials:
        'include' as RequestCredentials,
    },
    api,
    extra,
  );
  if (!rr.data) return false;
  const d = rr.data as {
    user: User;
    accessToken: string;
  };
  api.dispatch(
    setCredentials({
      user: d.user,
      accessToken: d.accessToken,
    }),
  );
  return true;
}

// Re-export FetchBaseQueryError to suppress
// the unused-import warning from the type param.
export type { FetchBaseQueryError };
