/**
 * @file useTotpEnroll.ts
 * Hook for TOTP enrolment, verification, disable.
 */
'use client';
import { useCallback, useState } from 'react';
import endpoints from
  '@/constants/auth-endpoints.json';
import type {
  TotpStatus, TotpEnrollData, UseTotpEnrollReturn,
} from './useTotpEnrollTypes';
export type {
  TotpStatus, TotpEnrollData, UseTotpEnrollReturn,
} from './useTotpEnrollTypes';

const post = async <T,>(
  url: string, body?: unknown,
): Promise<T> => {
  const r = await fetch(url, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
};
const em = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

/**
 * Manages TOTP 2FA enrolment lifecycle.
 * @returns Enrolment state and action handlers.
 */
export function useTotpEnroll(): UseTotpEnrollReturn {
  const [status, setStatus] =
    useState<TotpStatus>('idle');
  const [enrollData, setEnrollData] =
    useState<TotpEnrollData | null>(null);
  const [recoveryCodes, setRecoveryCodes] =
    useState<string[]>([]);
  const [error, setError] =
    useState<string | null>(null);

  const enroll = useCallback(async () => {
    setStatus('enrolling'); setError(null);
    try {
      setEnrollData(
        await post<TotpEnrollData>(
          endpoints.totp.enroll,
        ),
      );
    } catch (e) {
      setError(em(e)); setStatus('error');
    }
  }, []);

  const verify = useCallback(
    async (code: string) => {
      setStatus('verifying'); setError(null);
      try {
        type R = { recovery_codes: string[] };
        const d = await post<R>(
          endpoints.totp.verify, { code },
        );
        setRecoveryCodes(d.recovery_codes);
        setStatus('success');
      } catch (e) {
        setError(em(e)); setStatus('error');
      }
    }, [],
  );

  const disable = useCallback(
    async (code: string) => {
      setError(null);
      try {
        await post(endpoints.totp.disable, { code });
        setStatus('idle'); setEnrollData(null);
      } catch (e) {
        setError(em(e)); setStatus('error');
      }
    }, [],
  );

  return {
    status, enrollData, recoveryCodes,
    error, enroll, verify, disable,
  };
}
