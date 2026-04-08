/**
 * Auth-aware base query with 401 token refresh.
 * @module store/api/baseQueryReauth
 */
import { fetchBaseQuery } from
  '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn, FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import {
  clearCredentials, setCredentials,
} from '../slices/authSlice';
import type {
  TokenPair, User,
} from '../../types/auth';
import { captureDebugInfo } from './debugCapture';

/** Prefix for all API calls. */
const API_BASE = `${
  process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}/api`;

/** Raw fetchBaseQuery with auth header. */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ?? API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set(
        'Authorization', `Bearer ${token}`,
      );
    }
    return headers;
  },
});

/**
 * Base query that intercepts 401 responses and
 * attempts a silent token refresh before retrying.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, unknown, FetchBaseQueryError
> = async (args, api, extra) => {
  const start = Date.now();
  let result = await rawBaseQuery(args, api, extra);
  captureDebugInfo(args, result, start);

  const url = typeof args === 'string'
    ? args : args.url;
  if (
    result.error?.status === 401
    && !url.startsWith('/auth/')
  ) {
    const state = api.getState() as RootState;
    const rt = state.auth.refreshToken;
    if (rt) {
      const rr = await rawBaseQuery(
        { url: '/auth/refresh',
          method: 'POST', body: { refreshToken: rt },
        }, api, extra,
      );
      if (rr.data) {
        const { user, tokens } = rr.data as {
          user: User; tokens: TokenPair;
        };
        api.dispatch(
          setCredentials({ user, ...tokens }),
        );
        result = await rawBaseQuery(
          args, api, extra,
        );
      } else {
        api.dispatch(clearCredentials());
      }
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};
