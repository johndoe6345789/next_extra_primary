'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog } from '@shared/m3/Dialog';
import Typography from '@shared/m3/Typography';
import { useTotpEnroll } from '@/hooks/useTotpEnroll';
import { TotpQrStep } from './TotpQrStep';
import { TotpVerifyStep } from './TotpVerifyStep';

/** Props for TotpEnrollDialog. */
export interface TotpEnrollDialogProps {
  open: boolean;
  onClose: () => void;
  testId?: string;
}

/**
 * Multi-step dialog for TOTP 2FA enrolment.
 * Step 1: QR code + code entry.
 * Step 2: Recovery codes display.
 *
 * @param props - Component props.
 * @returns The TOTP enrolment dialog.
 */
export const TotpEnrollDialog: React.FC<
  TotpEnrollDialogProps
> = ({
  open,
  onClose,
  testId = 'totp-enroll-dialog',
}) => {
  const t = useTranslations('auth.totp');
  const {
    status, enrollData, recoveryCodes,
    error, enroll, verify,
  } = useTotpEnroll();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (open && status === 'idle') {
      void enroll();
    }
  }, [open, status, enroll]);

  const handleVerify = () => {
    void verify(code);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      testId={testId}
      aria-labelledby="totp-enroll-title"
    >
      <div style={{ padding: 24 }}>
        <Typography
          id="totp-enroll-title"
          variant="titleLarge"
          style={{ marginBottom: 16 }}
        >
          {t('enrollTitle')}
        </Typography>
        {status === 'success' ? (
          <TotpVerifyStep
            recoveryCodes={recoveryCodes}
            onClose={onClose}
          />
        ) : enrollData ? (
          <TotpQrStep
            otpauthUrl={enrollData.otpauth_url}
            code={code}
            onCodeChange={setCode}
            onVerify={handleVerify}
            busy={status === 'verifying'}
            error={error}
          />
        ) : (
          <Typography variant="bodyMedium">
            {t('loading')}
          </Typography>
        )}
      </div>
    </Dialog>
  );
};

export default TotpEnrollDialog;
