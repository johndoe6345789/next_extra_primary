'use client';

import { useState } from 'react';
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
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Encapsulates all state and logic for the login form.
 * Handles email/password state, validation, and submission.
 *
 * @returns Login form state and handlers.
 */
export function useLoginForm(): UseLoginFormReturn {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const { login, isLoading } = useAuth();
  const { validate, errors } = useFormValidation(LOGIN_RULES);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = validate('email', email) && validate('password', pw);
    if (ok) await login({ email, password: pw });
  };

  return { email, setEmail, pw, setPw, isLoading, errors, submit };
}
