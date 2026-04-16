'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { LoginForm as SharedLoginForm }
  from '@shared/ui/LoginForm';
import { useLoginForm } from '@/hooks/useLoginForm';
import { OAuthButtons } from
  '@/components/molecules/OAuthButtons';
import { PasskeyLoginButton } from
  '@/components/molecules/PasskeyLoginButton';
import { TotpLoginModal } from
  '@/components/organisms/TotpLoginModal';
import type { RootState } from '@/store/store';

/** Props for the LoginForm organism. */
export interface LoginFormProps {
  testId?: string;
  /** URL to redirect to after successful login (SSO). */
  next?: string;
}

/**
 * Login form wired to frontend auth hook.
 * Includes OAuth buttons, passkey login,
 * and TOTP second-factor modal.
 *
 * @param props - Component props.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  testId = 'login-form',
  next,
}) => {
  const t = useTranslations('auth');
  const {
    email, setEmail, pw, setPw,
    rememberMe, setRememberMe,
    isLoading, errors, apiError, errorCode,
    submit,
  } = useLoginForm({ next });
  const requireTotp = useSelector(
    (s: RootState) => s.auth.requireTotp,
  );
  const totpToken = useSelector(
    (s: RootState) => s.auth.totpSessionToken,
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
        }}
        data-testid="login-form-wrapper"
      >
        <SharedLoginForm
          email={email}
          setEmail={setEmail}
          pw={pw}
          setPw={setPw}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          isLoading={isLoading}
          errors={errors}
          apiError={apiError}
          errorCode={errorCode}
          submit={submit}
          testId={testId}
          labels={{
            login: t('login'),
            signingIn: t('signingIn'),
            forgotPassword: t('forgotPassword'),
            register: t('register'),
            email: t('email'),
            password: t('password'),
            rememberMe: t('rememberMe'),
          }}
        />
        <PasskeyLoginButton />
        <OAuthButtons />
      </div>
      <TotpLoginModal
        open={requireTotp}
        sessionToken={totpToken ?? ''}
      />
    </>
  );
};

export default LoginForm;
