'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';

/** Props for TotpQrStep. */
export interface TotpQrStepProps {
  otpauthUrl: string;
  code: string;
  onCodeChange: (v: string) => void;
  onVerify: () => void;
  busy: boolean;
  error: string | null;
  testId?: string;
}

/**
 * Shows a QR code for TOTP setup and a code input
 * field for the initial verification step.
 *
 * @param props - Component props.
 * @returns The QR step element.
 */
export const TotpQrStep: React.FC<
  TotpQrStepProps
> = ({
  otpauthUrl,
  code,
  onCodeChange,
  onVerify,
  busy,
  error,
  testId = 'totp-qr-step',
}) => {
  const t = useTranslations('auth.totp');

  return (
    <div
      data-testid={testId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Typography variant="bodyMedium">
        {t('scanInstruction')}
      </Typography>
      <QRCodeSVG
        value={otpauthUrl}
        size={180}
        aria-label={t('qrAlt')}
        data-testid="totp-qr-code"
      />
      <TextField
        label={t('codeLabel')}
        value={code}
        onChange={(e) =>
          onCodeChange(e.target.value)}
        inputProps={{
          maxLength: 6,
          inputMode: 'numeric',
          pattern: '[0-9]{6}',
          'aria-label': t('codeLabel'),
        }}
        data-testid="totp-code-input"
        fullWidth
      />
      {error && (
        <Typography
          variant="bodySmall"
          role="alert"
          style={{ color: 'var(--md-sys-color-error)' }}
        >
          {error}
        </Typography>
      )}
      <Button
        variant="filled"
        fullWidth
        disabled={busy || code.length !== 6}
        data-testid="totp-verify-btn"
        aria-label={t('verify')}
        onClick={onVerify}
      >
        {busy ? t('verifying') : t('verify')}
      </Button>
    </div>
  );
};

export default TotpQrStep;
