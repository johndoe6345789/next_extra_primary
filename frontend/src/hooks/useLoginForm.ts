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
  /** Whether an auth request is in flight. */
  isLoading: boolean;
  /** Validation errors keyed by field name. */
  errors: Record<string, string | undefined>;
  /** Server-side error message. */
  apiError: string | null;
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
  const [apiError, setApiError] =
    useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { validate, errors } =
    useFormValidation(LOGIN_RULES);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const ok =
      validate('email', email)
      && validate('password', pw);
    if (!ok) return;
    try {
      await login({ email, password: pw });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })
          ?.data?.message
        ?? 'Login failed. Please try again.';
      setApiError(msg);
    }
  };

  return {
    email, setEmail, pw, setPw,
    isLoading, errors, apiError, submit,
  };
}
