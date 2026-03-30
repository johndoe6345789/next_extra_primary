'use client';

import { useState } from 'react';
import { useForgotPasswordMutation }
  from '@/store/api/authApi';

/** Return type for useForgotPassword hook. */
export interface UseForgotPasswordReturn {
  /** Current email value. */
  email: string;
  /** Email setter. */
  setEmail: (v: string) => void;
  /** Whether submission is in flight. */
  isLoading: boolean;
  /** Whether reset email was sent. */
  success: boolean;
  /** Server-side error message. */
  apiError: string | null;
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Encapsulates state and logic for forgot password.
 *
 * @returns Forgot password form state and handlers.
 */
export function useForgotPassword():
  UseForgotPasswordReturn {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] =
    useState<string | null>(null);
  const [forgotPw, { isLoading }] =
    useForgotPasswordMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccess(false);
    try {
      await forgotPw({ email }).unwrap();
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })
          ?.data?.message
        ?? 'Something went wrong.';
      setApiError(msg);
    }
  };

  return {
    email, setEmail,
    isLoading, success, apiError, submit,
  };
}
