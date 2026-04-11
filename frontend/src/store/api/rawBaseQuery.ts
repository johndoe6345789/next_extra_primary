/**
 * @file rawBaseQuery.ts
 * @brief Bare fetchBaseQuery with Authorization
 *        header injection from Redux auth state.
 */
import { fetchBaseQuery } from
  '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

/** Prefix for all API calls. */
const API_BASE = `${
  process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}/api`;

/**
 * Raw fetchBaseQuery that attaches the access token
 * from Redux state as a Bearer Authorization header.
 */
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
