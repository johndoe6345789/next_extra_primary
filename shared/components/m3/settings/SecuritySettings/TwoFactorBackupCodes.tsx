'use client';

import React from 'react';

interface TwoFactorBackupCodesProps {
  codes: string[];
  onDismiss: () => void;
}

/**
 * Displays backup codes after enabling 2FA.
 */
export const TwoFactorBackupCodes: React.FC<
  TwoFactorBackupCodesProps
> = ({ codes, onDismiss }) => (
  <div>
    <p>
      Save these backup codes in a safe place:
    </p>
    <div>
      {codes.map((code, idx) => (
        <div key={idx}>{code}</div>
      ))}
    </div>
    <button
      className={''}
      onClick={onDismiss}
    >
      I Saved My Backup Codes
    </button>
  </div>
);

export default TwoFactorBackupCodes;
