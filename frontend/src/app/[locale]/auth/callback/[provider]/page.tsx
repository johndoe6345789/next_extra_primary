'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams }
  from 'next/navigation';
import { useLocale } from 'next-intl';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@shared/m3';
import { setCredentials } from
  '@/store/slices/authSlice';
import endpoints from
  '@/constants/auth-endpoints.json';
import type { AppDispatch } from '@/store/store';
import type { LoginResponse } from '@/types/auth';

/**
 * OAuth callback page. On mount it forwards the
 * code + state params to the backend, stores
 * credentials on success, and redirects.
 *
 * @returns Loading spinner while processing.
 */
export default function OAuthCallbackPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();
  const { provider } =
    useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = searchParams.get('code') ?? '';
    const state = searchParams.get('state') ?? '';
    const url =
      endpoints.oauth.callback.replace(
        ':provider',
        provider ?? '',
      );

    void (async () => {
      try {
        const r = await fetch(
          `${url}?code=${encodeURIComponent(code)}`
          + `&state=${encodeURIComponent(state)}`,
          { credentials: 'include' },
        );
        if (!r.ok) throw new Error('oauth failed');
        const data = (await r.json()) as LoginResponse;
        dispatch(setCredentials({
          user: data.user,
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
        }));
        router.push(`/${locale}/dashboard`);
      } catch {
        router.push(
          `/${locale}/login?error=oauth`,
        );
      }
    })();
  }, [
    dispatch, locale, provider,
    router, searchParams,
  ]);

  return (
    <div
      data-testid="oauth-callback"
      role="status"
      aria-label="Completing sign-in"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
      }}
    >
      <CircularProgress testId="oauth-spinner" />
    </div>
  );
}
