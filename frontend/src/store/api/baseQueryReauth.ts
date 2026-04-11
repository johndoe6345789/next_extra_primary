/**
 * Auth-aware base query with 401 token refresh.
 * @module store/api/baseQueryReauth
 */
import type {
  BaseQueryFn, FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import {
  clearCredentials, setCredentials,
} from '../slices/authSlice';
import type { TokenPair, User } from
  '../../types/auth';
import { captureDebugInfo } from './debugCapture';
import { reauthViaCookie } from
  './reauthViaCookie';
import { rawBaseQuery } from './rawBaseQuery';

export { rawBaseQuery };

/**
 * Base query that intercepts 401 responses and
 * attempts a silent token refresh before retrying.
 * Uses /auth/refresh when a refresh token is held in
 * Redux state, or falls back to the HttpOnly SSO
 * cookie via /auth/sso-session.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, unknown, FetchBaseQueryError
> = async (args, api, extra) => {
  const start = Date.now();
  let result = await rawBaseQuery(args, api, extra);
  captureDebugInfo(args, result, start);

  const url =
    typeof args === 'string' ? args : args.url;
  if (
    result.error?.status === 401
    && !url.startsWith('/auth/')
  ) {
    const state = api.getState() as RootState;
    const rt = state.auth.refreshToken;
    let refreshed = false;

    if (rt) {
      const rr = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST',
          body: { refreshToken: rt } },
        api, extra,
      );
      if (rr.data) {
        const { user, tokens } = rr.data as {
          user: User; tokens: TokenPair;
        };
        api.dispatch(
          setCredentials({ user, ...tokens }),
        );
        refreshed = true;
      }
    } else {
      refreshed =
        await reauthViaCookie(api, extra);
    }

    if (refreshed) {
      result = await rawBaseQuery(
        args, api, extra,
      );
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};
