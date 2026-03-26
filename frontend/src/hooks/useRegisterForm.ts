'use client';

import { useState } from 'react';
import { useAuth, useFormValidation } from '@/hooks';
import {
  REG_RULES,
  type RegFields,
  type CE,
} from '@/components/organisms/registerRules';

/** Return type for the useRegisterForm hook. */
export interface UseRegisterFormReturn {
  /** Current form field values. */
  f: RegFields;
  /** Field setter factory — returns a change handler. */
  set: (k: string) => (e: CE) => void;
  /** Whether an auth request is in flight. */
  isLoading: boolean;
  /** Validation errors keyed by field name. */
  errors: Record<string, string | undefined>;
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Encapsulates all state and logic for the registration form.
 * Handles field state, validation, and submission.
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
  const { register, isLoading } = useAuth();
  const { validate, errors } = useFormValidation(REG_RULES);

  const set = (k: string) => (e: CE) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = Object.keys(REG_RULES).every((k) =>
      validate(k, f[k as keyof RegFields]),
    );
    if (f.password !== f.confirmPassword) return;
    if (!ok) return;
    await register({
      username: f.username,
      email: f.email,
      displayName: f.displayName,
      password: f.password,
    });
  };

  return { f, set, isLoading, errors, submit };
}
