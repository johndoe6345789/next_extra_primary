'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Button from '@shared/m3/Button';
import { usePasskey } from '@/hooks/usePasskey';

/** Props for PasskeyLoginButton. */
export interface PasskeyLoginButtonProps {
  /** data-testid override. */
  testId?: string;
}

/**
 * Standalone "Sign in with passkey" button.
 * Calls the WebAuthn assertion flow and redirects
 * to dashboard on success.
 *
 * @param props - Component props.
 * @returns The passkey login button.
 */
export const PasskeyLoginButton: React.FC<
  PasskeyLoginButtonProps
> = ({ testId = 'passkey-login-btn' }) => {
  const t = useTranslations('auth.passkey');
  const { assert, busy, error } = usePasskey();
  const router = useRouter();
  const locale = useLocale();

  const handleClick = async () => {
    await assert();
    if (!error) {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <Button
        variant="tonal"
        fullWidth
        disabled={busy}
        data-testid={testId}
        aria-label={t('signIn')}
        onClick={handleClick}
      >
        {busy ? t('verifying') : t('signIn')}
      </Button>
      {error && (
        <p
          role="alert"
          style={{ color: 'var(--md-sys-color-error)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PasskeyLoginButton;
