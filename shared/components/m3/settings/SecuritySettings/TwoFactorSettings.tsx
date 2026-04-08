'use client';
/**
 * TwoFactorSettings Component
 * Two-factor authentication management
 */

import React from 'react';
import { TwoFactorSetupForm }
  from './TwoFactorSetupForm';
import { TwoFactorBackupCodes }
  from './TwoFactorBackupCodes';
import { useTwoFactor } from './useTwoFactor';

interface TwoFactorSettingsProps {
  onStatusChange?: (enabled: boolean) => void;
  testId?: string;
}

/**
 * 2FA toggle, setup, and backup code display.
 */
export const TwoFactorSettings: React.FC<
  TwoFactorSettingsProps
> = ({ onStatusChange, testId }) => {
  const tf = useTwoFactor(onStatusChange);

  return (
    <div data-testid={testId}>
      <h3>Two-Factor Authentication</h3>
      <p>
        Add an extra layer of security to your
        account
      </p>
      <div>
        <span>Status:</span>
        <span>
          {tf.twoFactorEnabled
            ? 'Enabled' : 'Not Enabled'}
        </span>
      </div>
      {!tf.twoFactorEnabled && !tf.showSetup && (
        <button
          onClick={() => tf.setShowSetup(true)}>
          Enable 2FA
        </button>
      )}
      {tf.showSetup && !tf.twoFactorEnabled && (
        <TwoFactorSetupForm
          verificationCode={
            tf.verificationCode}
          onCodeChange={tf.setVerificationCode}
          onVerify={tf.handleVerifyAndEnable}
          onCancel={() =>
            tf.setShowSetup(false)}
          isEnabling={tf.isEnabling} />
      )}
      {tf.showBackupCodes &&
        tf.twoFactorEnabled && (
        <TwoFactorBackupCodes
          codes={tf.backupCodes}
          onDismiss={() =>
            tf.setShowBackupCodes(false)} />
      )}
      {tf.twoFactorEnabled &&
        !tf.showBackupCodes && (
        <button onClick={tf.handleDisable}>
          Disable 2FA
        </button>
      )}
    </div>
  );
};

export default TwoFactorSettings;
