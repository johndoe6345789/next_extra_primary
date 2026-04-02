'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ForgotPasswordForm as SharedForm }
  from '@shared/ui/ForgotPasswordForm';
import {
  useForgotPassword,
} from '@/hooks/useForgotPassword';

/** Props for ForgotPasswordForm. */
export interface ForgotPasswordFormProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Forgot password form wired to frontend hook.
 *
 * @param props - Component props.
 */
export const ForgotPasswordForm: React.FC<
  ForgotPasswordFormProps
> = ({ testId = 'forgot-password-form' }) => {
  const t = useTranslations('auth');
  const {
    email, setEmail,
    isLoading, success, apiError, submit,
  } = useForgotPassword();

  return (
    <SharedForm
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      success={success}
      apiError={apiError}
      submit={submit}
      testId={testId}
      labels={{
        resetPassword: t('resetPassword'),
        resetInstructions: t('resetInstructions'),
        email: t('email'),
        sending: t('sending'),
        resetSent: t('resetSent'),
        backToLogin: t('backToLogin'),
      }}
    />
  );
};

export default ForgotPasswordForm;
