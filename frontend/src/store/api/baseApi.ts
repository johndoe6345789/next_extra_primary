/**
 * Base RTK Query API with auth-aware base query.
 * Handles token attachment and 401 refresh logic.
 * @module store/api/baseApi
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import { clearCredentials, setCredentials } from '../slices/authSlice';
import type { TokenPair, User } from '../../types/auth';

/** Prefix for all API calls (includes basePath). */
const API_BASE = `${
  process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}/api`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Base query that intercepts 401 responses and
 * attempts a silent token refresh before retrying.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { user, tokens } = refreshResult.data as {
          user: User;
          tokens: TokenPair;
        };
        api.dispatch(setCredentials({ user, ...tokens }));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearCredentials());
      }
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

/** Root RTK Query API — inject endpoints elsewhere. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth', 'User', 'Notification',
    'Gamification', 'Chat',
    'Dashboard', 'Features',
  ],
  endpoints: () => ({}),
});
