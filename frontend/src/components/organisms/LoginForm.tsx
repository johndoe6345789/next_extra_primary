'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import MuiLink from '@shared/m3/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { LoginFormFields } from './LoginFormFields';
import { useLoginForm } from '@/hooks/useLoginForm';

/** Props for the LoginForm organism. */
export interface LoginFormProps {
  testId?: string;
}

/**
 * Login card with email, password, submit,
 * forgot password and register links.
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
    <div className="auth-card" data-testid={testId}>
        <h2 id="login-heading">
          {t('login')}
        </h2>
        <form
          role="form"
          aria-labelledby="login-heading"
          onSubmit={submit}
        >
          {apiError && (
            <Alert severity="error" data-testid="login-error">
              {apiError}
            </Alert>
          )}
          <LoginFormFields
            email={email}
            pw={pw}
            setEmail={setEmail}
            setPw={setPw}
            errors={errors}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            testId="login-submit"
          >
            {isLoading ? t('signingIn') : t('login')}
          </Button>
          <div className="auth-form__links">
            <MuiLink
              component={Link}
              tabIndex={0}
              href="/forgot-password"
              variant="body2"
            >
              {t('forgotPassword')}
            </MuiLink>
            <MuiLink
              component={Link}
              tabIndex={0}
              href="/register"
              variant="body2"
            >
              {t('register')}
            </MuiLink>
          </div>
        </form>
    </div>
  );
};

export default LoginForm;
