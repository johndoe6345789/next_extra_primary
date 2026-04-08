'use client';

import React from 'react';

interface AccountDeletionConfirmProps {
  userEmail: string;
  confirmEmail: string;
  onConfirmEmailChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

/**
 * Confirmation panel for account deletion
 * with email verification.
 */
export const AccountDeletionConfirm: React.FC<
  AccountDeletionConfirmProps
> = ({
  userEmail,
  confirmEmail,
  onConfirmEmailChange,
  onConfirm,
  onCancel,
  isDeleting,
}) => (
  <div>
    <div>
      <p>Are you sure?</p>
      <p>
        Deleting your account is permanent. All
        data, workflows, and projects will be
        permanently deleted.
      </p>
    </div>
    <div>
      <label htmlFor="deleteEmail">
        Type your email to confirm:
      </label>
      <input
        id="deleteEmail"
        type="email"
        value={confirmEmail}
        onChange={(e) =>
          onConfirmEmailChange(e.target.value)
        }
        placeholder={userEmail}
      />
      <p>
        We need to confirm you own this account
      </p>
    </div>
    <div>
      <button
        className={''}
        onClick={onConfirm}
        disabled={
          isDeleting ||
          confirmEmail !== userEmail
        }
      >
        {isDeleting
          ? 'Deleting...'
          : 'Delete Account Permanently'}
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
);

export default AccountDeletionConfirm;
