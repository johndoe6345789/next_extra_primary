'use client';
/**
 * @file useInitAuth.ts
 * @brief Bootstraps auth state from the SSO cookie on
 *        app startup — no tokens stored in localStorage.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import type { User } from '@/types/auth';

/** Shape returned by GET /api/auth/sso-session. */
interface SsoSessionResponse {
  accessToken: string;
  user: User;
}

/**
 * Calls GET /api/auth/sso-session once on mount.
 * If the HttpOnly SSO cookie is valid the endpoint
 * returns a fresh access token + user profile, which
 * are dispatched into Redux.  On failure the user
 * remains unauthenticated (will be redirected by nginx).
 */
export function useInitAuth(): void {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/api/auth/sso-session', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data =
          (await res.json()) as SsoSessionResponse;
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.accessToken,
          }),
        );
      })
      .catch(() => {
        // No cookie or network error — stay unauthenticated.
      });
  }, [dispatch]);
}
