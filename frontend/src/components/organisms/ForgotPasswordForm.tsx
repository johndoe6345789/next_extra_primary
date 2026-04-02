'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import TextField from '@shared/m3/TextField';
import MuiLink from '@shared/m3/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { useForgotPassword } from '@/hooks/useForgotPassword';

/** Props for ForgotPasswordForm. */
export interface ForgotPasswordFormProps {
  /** data-testid attribute. */
  testId?: string;
}

/** Forgot password card with email field. */
export const ForgotPasswordForm: React.FC<
  ForgotPasswordFormProps
> = ({ testId = 'forgot-password-form' }) => {
  const t = useTranslations('auth');
  const {
    email, setEmail,
    isLoading, success, apiError, submit,
  } = useForgotPassword();

  return (
    <div
      className="auth-card"
      data-testid={testId}
    >
      <h2 id="forgot-heading">
        {t('resetPassword')}
      </h2>
      <p className="text-text.secondary mb-md">
        {t('resetInstructions')}
      </p>
      <form
        role="form"
        aria-labelledby="forgot-heading"
        onSubmit={submit}
      >
        {apiError && (
          <Alert
            severity="error"
            data-testid="forgot-error"
          >
            {apiError}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            data-testid="forgot-success"
          >
            {t('resetSent')}
          </Alert>
        )}
        <div className="form-field">
          <TextField
            label={t('email')}
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<
              HTMLInputElement
              | HTMLTextAreaElement
            >) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
        </div>
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          testId="forgot-submit"
        >
          {isLoading
            ? t('sending')
            : t('resetPassword')}
        </Button>
        <div className="auth-form__links">
          <MuiLink
            component={Link}
            href="/login"
            variant="body2"
            tabIndex={0}
          >
            {t('backToLogin')}
          </MuiLink>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
