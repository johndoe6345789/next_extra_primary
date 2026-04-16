'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFormValidation } from '@/hooks';
import {
  REG_RULES,
  type RegFields,
  type CE,
} from '@/components/organisms/registerRules';
import { useAnalytics }
  from '@/hooks/useAnalytics';
import EVENTS
  from '@/constants/analytics-events.json';

/** Return type for the useRegisterForm hook. */
export interface UseRegisterFormReturn {
  /** Current form field values. */
  f: RegFields;
  /** Field setter factory. */
  set: (k: string) => (e: CE) => void;
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
 * Encapsulates state and logic for registration.
 *
 * @returns Register form state and handlers.
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const [f, setF] = useState<RegFields>({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const [apiError, setApiError] =
    useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const { validate, errors } =
    useFormValidation(REG_RULES);
  const router = useRouter();
  const { track } = useAnalytics();

  const set = (k: string) => (e: CE) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const ok = Object.keys(REG_RULES).every((k) =>
      validate(k, f[k as keyof RegFields]),
    );
    if (f.password !== f.confirmPassword) return;
    if (!ok) return;
    try {
      await register({
        username: f.username,
        email: f.email,
        displayName: f.displayName,
        password: f.password,
      });
      track(EVENTS.SIGNUP);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })
          ?.data?.message
        ?? 'Registration failed. Please try again.';
      setApiError(msg);
    }
  };

  return {
    f, set, isLoading, errors, apiError, submit,
  };
}
