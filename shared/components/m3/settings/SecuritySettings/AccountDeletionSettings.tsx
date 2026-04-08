'use client';
/**
 * AccountDeletionSettings Component
 * Account deletion with email confirmation
 */

import React, { useState, useCallback } from 'react';
import { AccountDeletionConfirm } from './AccountDeletionConfirm';

interface AccountDeletionSettingsProps {
  userEmail?: string;
  onAccountDeleted?: () => void;
  testId?: string;
}

/**
 * Danger zone section with account deletion.
 */
export const AccountDeletionSettings: React.FC<
  AccountDeletionSettingsProps
> = ({
  userEmail = 'john@example.com',
  onAccountDeleted,
  testId,
}) => {
  const [showConfirm, setShowConfirm] =
    useState(false);
  const [confirmEmail, setConfirmEmail] =
    useState('');
  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleConfirmDelete =
    useCallback(async () => {
      if (confirmEmail !== userEmail) {
        alert(
          'Email does not match. Try again.'
        );
        return;
      }
      setIsDeleting(true);
      try {
        await new Promise((r) =>
          setTimeout(r, 1500)
        );
        onAccountDeleted?.();
      } catch {
        alert('Failed to delete account.');
      } finally {
        setIsDeleting(false);
      }
    }, [confirmEmail, userEmail, onAccountDeleted]);

  const handleCancel = useCallback(() => {
    setShowConfirm(false);
    setConfirmEmail('');
  }, []);

  return (
    <div className={''} data-testid={testId}>
      <h3>Danger Zone</h3>
      <p>
        These actions are permanent and cannot be
        undone
      </p>
      {!showConfirm ? (
        <button
          className={''}
          onClick={() => setShowConfirm(true)}
        >
          Delete Account
        </button>
      ) : (
        <AccountDeletionConfirm
          userEmail={userEmail}
          confirmEmail={confirmEmail}
          onConfirmEmailChange={setConfirmEmail}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default AccountDeletionSettings;
