/**
 * @file useTotpLogin.ts
 * @module hooks/useTotpLogin
 *
 * Hook that drives the TOTP second-factor
 * verification during login.
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  setCredentials,
  clearTotpChallenge,
} from '@/store/slices/authSlice';
import endpoints from
  '@/constants/auth-endpoints.json';
import type { AppDispatch } from '@/store/store';
import type { LoginResponse } from '@/types/auth';

/** Return shape of useTotpLogin. */
export interface UseTotpLoginReturn {
  code: string;
  setCode: (v: string) => void;
  busy: boolean;
  error: string | null;
  handleVerify: () => Promise<void>;
}

/**
 * Drives TOTP login step: POSTs the 6-digit code
 * to the backend, dispatches credentials, and
 * redirects to dashboard on success.
 *
 * @param sessionToken - Short-lived TOTP token.
 * @returns Code state and submit handler.
 */
export function useTotpLogin(
  sessionToken: string,
): UseTotpLoginReturn {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(
        endpoints.totp.verifyLogin,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            totp_session_token: sessionToken,
          }),
        },
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data =
        (await r.json()) as LoginResponse;
      dispatch(setCredentials({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      }));
      dispatch(clearTotpChallenge());
      router.push(`/${locale}/dashboard`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Verification failed.',
      );
    } finally {
      setBusy(false);
    }
  }, [code, sessionToken, dispatch, router, locale]);

  return { code, setCode, busy, error, handleVerify };
}
