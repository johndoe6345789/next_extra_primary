'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { LoginForm as SharedLoginForm }
  from '@shared/ui/LoginForm';
import { useLoginForm } from '@/hooks/useLoginForm';

/** Props for the LoginForm organism. */
export interface LoginFormProps {
  testId?: string;
}

/**
 * Login form wired to frontend auth hook.
 *
 * @param props - Component props.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  testId = 'login-form',
}) => {
  const t = useTranslations('auth');
  const {
    email, setEmail, pw, setPw,
    isLoading, errors, apiError, submit,
  } = useLoginForm();

  return (
    <SharedLoginForm
      email={email}
      setEmail={setEmail}
      pw={pw}
      setPw={setPw}
      isLoading={isLoading}
      errors={errors}
      apiError={apiError}
      submit={submit}
      testId={testId}
      labels={{
        login: t('login'),
        signingIn: t('signingIn'),
        forgotPassword: t('forgotPassword'),
        register: t('register'),
        email: t('email'),
        password: t('password'),
      }}
    />
  );
};

export default LoginForm;
