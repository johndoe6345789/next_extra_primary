'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';

/** Props for TotpVerifyStep. */
export interface TotpVerifyStepProps {
  recoveryCodes: string[];
  onClose: () => void;
  testId?: string;
}

/**
 * Shows the recovery codes after successful TOTP
 * enrolment and a close/done button.
 *
 * @param props - Component props.
 * @returns The recovery codes step element.
 */
export const TotpVerifyStep: React.FC<
  TotpVerifyStepProps
> = ({
  recoveryCodes,
  onClose,
  testId = 'totp-verify-step',
}) => {
  const t = useTranslations('auth.totp');

  return (
    <div
      data-testid={testId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Typography variant="titleMedium">
        {t('recoveryCodes')}
      </Typography>
      <Typography variant="bodySmall">
        {t('recoveryCodesInfo')}
      </Typography>
      <ul
        aria-label={t('recoveryCodes')}
        style={{
          listStyle: 'none',
          padding: 0,
          fontFamily: 'monospace',
        }}
      >
        {recoveryCodes.map((code) => (
          <li
            key={code}
            data-testid="totp-recovery-code"
          >
            {code}
          </li>
        ))}
      </ul>
      <Button
        variant="filled"
        fullWidth
        data-testid="totp-done-btn"
        aria-label={t('done')}
        onClick={onClose}
      >
        {t('done')}
      </Button>
    </div>
  );
};

export default TotpVerifyStep;
