'use client';

import { useState, useCallback } from 'react';

/**
 * State and handlers for 2FA management.
 * @param onStatusChange - Callback for status.
 * @returns 2FA state and actions.
 */
export function useTwoFactor(
  onStatusChange?: (enabled: boolean) => void
) {
  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);
  const [showSetup, setShowSetup] =
    useState(false);
  const [verificationCode, setVerificationCode] =
    useState('');
  const [isEnabling, setIsEnabling] =
    useState(false);
  const [backupCodes, setBackupCodes] =
    useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] =
    useState(false);

  const handleVerifyAndEnable =
    useCallback(async () => {
      if (verificationCode.length !== 6) {
        alert(
          'Please enter a valid 6-digit code'
        );
        return;
      }
      setIsEnabling(true);
      try {
        await new Promise((r) =>
          setTimeout(r, 1200));
        setTwoFactorEnabled(true);
        setShowSetup(false);
        setShowBackupCodes(true);
        setBackupCodes([
          'XXXX-XXXX-XXXX',
          'YYYY-YYYY-YYYY',
          'ZZZZ-ZZZZ-ZZZZ',
        ]);
        onStatusChange?.(true);
      } catch {
        alert(
          'Failed to enable 2FA. Try again.'
        );
      } finally { setIsEnabling(false); }
    }, [verificationCode, onStatusChange]);

  const handleDisable =
    useCallback(async () => {
      if (confirm(
        'Are you sure you want to disable 2FA?'
      )) {
        setTwoFactorEnabled(false);
        onStatusChange?.(false);
      }
    }, [onStatusChange]);

  return {
    twoFactorEnabled, showSetup, setShowSetup,
    verificationCode, setVerificationCode,
    isEnabling, backupCodes, showBackupCodes,
    setShowBackupCodes,
    handleVerifyAndEnable, handleDisable,
  };
}
