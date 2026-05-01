/**
 * @file rawBaseQuery.ts
 * @brief Bare fetchBaseQuery with Authorization
 *        header injection from Redux auth state.
 */
import { fetchBaseQuery } from
  '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import {
  COOKIE, readCookie,
} from '@/lib/keycloakCookies';

// API calls go through nginx, which routes /api/* to the
// right microservice (e.g. /api/forum/* → nextra-comments,
// /api/auth/* → backend). We must NOT prefix with the
// frontend's basePath (/app) — that path is reserved for
// the Next.js app itself, and a /app/api/* call would be
// served by the frontend container's rewrite rules and
// only reach the legacy backend, missing /api/forum/*,
// /api/notifications/*, etc.
const API_BASE = '/api';

/** Hard cap on any single API request. Beyond this
 *  the user almost certainly wants to retry rather
 *  than keep waiting on a wedged response — better
 *  to surface an error than spin forever. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Raw fetchBaseQuery that attaches the access token
 * from Redux state as a Bearer Authorization header
 * and aborts requests that exceed the timeout.
 */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ?? API_BASE,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken
      ?? readCookie(COOKIE.access);
    if (token) {
      headers.set(
        'Authorization', `Bearer ${token}`,
      );
    }
    return headers;
  },
});
