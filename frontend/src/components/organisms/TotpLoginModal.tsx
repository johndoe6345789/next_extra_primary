'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Dialog } from '@shared/m3/Dialog';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';
import { useTotpLogin } from
  '@/hooks/useTotpLogin';

/** Props for TotpLoginModal. */
export interface TotpLoginModalProps {
  open: boolean;
  sessionToken: string;
  testId?: string;
}

/**
 * Dialog for TOTP second-factor login.
 * Shown when backend returns require_totp: true.
 *
 * @param props - Component props.
 * @returns The TOTP login modal.
 */
export const TotpLoginModal: React.FC<
  TotpLoginModalProps
> = ({
  open,
  sessionToken,
  testId = 'totp-login-modal',
}) => {
  const t = useTranslations('auth.totp');
  const {
    code, setCode, busy, error, handleVerify,
  } = useTotpLogin(sessionToken);

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      disableBackdropClick
      maxWidth="xs"
      fullWidth
      testId={testId}
      aria-labelledby="totp-login-title"
    >
      <div style={{ padding: 24 }}>
        <Typography
          id="totp-login-title"
          variant="titleLarge"
          style={{ marginBottom: 16 }}
        >
          {t('loginTitle')}
        </Typography>
        <TextField
          label={t('codeLabel')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputProps={{
            maxLength: 6,
            inputMode: 'numeric',
            'aria-label': t('codeLabel'),
          }}
          data-testid="totp-login-input"
          fullWidth
        />
        {error && (
          <Typography
            role="alert"
            variant="bodySmall"
            style={{
              color: 'var(--md-sys-color-error)',
              marginTop: 8,
            }}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="filled"
          fullWidth
          disabled={busy || code.length !== 6}
          data-testid="totp-login-verify-btn"
          aria-label={t('verify')}
          onClick={handleVerify}
          style={{ marginTop: 16 }}
        >
          {busy ? t('verifying') : t('verify')}
        </Button>
      </div>
    </Dialog>
  );
};

export default TotpLoginModal;
