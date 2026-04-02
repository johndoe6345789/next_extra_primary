'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RegisterForm as SharedRegisterForm }
  from '@shared/ui/RegisterForm';
import {
  useRegisterForm,
} from '@/hooks/useRegisterForm';

/** Props for the RegisterForm organism. */
export interface RegisterFormProps {
  testId?: string;
}

/**
 * Registration form wired to frontend auth hook.
 *
 * @param props - Component props.
 */
export const RegisterForm: React.FC<
  RegisterFormProps
> = ({ testId = 'register-form' }) => {
  const t = useTranslations('auth');
  const {
    f, set, isLoading, errors, apiError, submit,
  } = useRegisterForm();

  return (
    <SharedRegisterForm
      f={f}
      set={set}
      isLoading={isLoading}
      errors={errors}
      apiError={apiError}
      submit={submit}
      testId={testId}
      labels={{
        register: t('register'),
        creating: t('creating'),
        hasAccount: t('hasAccount'),
        username: t('username'),
        email: t('email'),
        displayName: t('displayName'),
        password: t('password'),
        confirmPassword: t('confirmPassword'),
        passwordsMustMatch: t('passwordsMustMatch'),
      }}
    />
  );
};

export default RegisterForm;
