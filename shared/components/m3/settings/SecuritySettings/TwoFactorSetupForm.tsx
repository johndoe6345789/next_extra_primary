'use client';

import React from 'react';

interface TwoFactorSetupFormProps {
  verificationCode: string;
  onCodeChange: (v: string) => void;
  onVerify: () => void;
  onCancel: () => void;
  isEnabling: boolean;
}

/**
 * Verification code entry form for enabling
 * two-factor authentication.
 */
export const TwoFactorSetupForm: React.FC<
  TwoFactorSetupFormProps
> = ({
  verificationCode,
  onCodeChange,
  onVerify,
  onCancel,
  isEnabling,
}) => (
  <div>
    <p>
      Scan this QR code with your authenticator
      app, then enter the 6-digit code:
    </p>
    <div>
      <label htmlFor="verificationCode">
        Verification Code
      </label>
      <input
        id="verificationCode"
        type="text"
        value={verificationCode}
        onChange={(e) =>
          onCodeChange(
            e.target.value.slice(0, 6)
          )
        }
        placeholder="000000"
        maxLength={6}
      />
    </div>
    <div>
      <button
        className={''}
        onClick={onVerify}
        disabled={isEnabling}
      >
        {isEnabling
          ? 'Enabling...'
          : 'Verify & Enable'}
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
);

export default TwoFactorSetupForm;
