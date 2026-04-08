'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFormValidation } from '@/hooks';
import { LOGIN_RULES } from '@/components/organisms/loginRules';

/** Return type for the useLoginForm hook. */
export interface UseLoginFormReturn {
  /** Current email value. */
  email: string;
  /** Email setter. */
  setEmail: (v: string) => void;
  /** Current password value. */
  pw: string;
  /** Password setter. */
  setPw: (v: string) => void;
  /** Whether "remember me" is checked. */
  rememberMe: boolean;
  /** Remember-me setter. */
  setRememberMe: (v: boolean) => void;
  /** Whether an auth request is in flight. */
  isLoading: boolean;
  /** Validation errors keyed by field name. */
  errors: Record<string, string | undefined>;
  /** Server-side error message. */
  apiError: string | null;
  /** Backend error code (e.g. AUTH_001). */
  errorCode: string | null;
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Encapsulates state and logic for the login form.
 *
 * @returns Login form state and handlers.
 */
export function useLoginForm(): UseLoginFormReturn {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] =
    useState<string | null>(null);
  const [errorCode, setErrorCode] =
    useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { validate, errors } =
    useFormValidation(LOGIN_RULES);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrorCode(null);
    const ok =
      validate('email', email)
      && validate('password', pw);
    if (!ok) return;
    try {
      await login({ email, password: pw });
      router.push('/dashboard');
    } catch (err: unknown) {
      const data = (err as {
        data?: { error?: string; code?: string };
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
