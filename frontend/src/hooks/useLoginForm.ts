'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFormValidation } from '@/hooks';
import { LOGIN_RULES }
  from '@/components/organisms/loginRules';
import { useAnalytics }
  from '@/hooks/useAnalytics';
import EVENTS
  from '@/constants/analytics-events.json';
import type {
  UseLoginFormOptions,
  UseLoginFormReturn,
} from './useLoginFormTypes';

export type {
  UseLoginFormOptions, UseLoginFormReturn,
} from './useLoginFormTypes';

/**
 * Encapsulates state and logic for the login
 * form. Redirects to `next` after success (for
 * SSO flows), or /dashboard when absent.
 *
 * @param opts - Optional next-redirect URL.
 * @returns Login form state and handlers.
 */
export function useLoginForm(
  opts: UseLoginFormOptions = {},
): UseLoginFormReturn {
  const { next } = opts;
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [rememberMe, setRememberMe] =
    useState(true);
  const [apiError, setApiError] =
    useState<string | null>(null);
  const [errorCode, setErrorCode] =
    useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { validate, errors } =
    useFormValidation(LOGIN_RULES);
  const router = useRouter();
  const { track } = useAnalytics();

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setApiError(null);
    setErrorCode(null);
    const ok =
      validate('email', email)
      && validate('password', pw);
    if (!ok) return;
    try {
      await login({ email, password: pw });
      track(EVENTS.LOGIN);
      router.push(next ?? '/dashboard');
    } catch (err: unknown) {
      const data = (err as {
        data?: {
          error?: string;
          code?: string;
        };
      })?.data;
      setApiError(
        data?.error
        ?? 'Login failed. Please try again.',
      );
      setErrorCode(data?.code ?? null);
    }
  };

  return {
    email, setEmail, pw, setPw,
    rememberMe, setRememberMe,
    isLoading, errors, apiError, errorCode,
    submit,
  };
}
