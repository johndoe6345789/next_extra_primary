'use client';

import React from 'react';
import type { PasswordChangeFormProps }
  from './passwordFormTypes';

export type {
  PasswordFormState,
  PasswordChangeFormProps,
} from './passwordFormTypes';

/** Password change form with validation. */
export const PasswordChangeForm: React.FC<
  PasswordChangeFormProps
> = ({ form, error, isChanging,
  onInputChange, onSubmit, onCancel,
}) => (
  <div>
    <div>
      <label htmlFor="currentPassword">
        Current Password
      </label>
      <input id="currentPassword"
        type="password" name="currentPassword"
        value={form.currentPassword}
        onChange={onInputChange}
        placeholder={
          'Enter your current password'
        } />
    </div>
    <div>
      <label htmlFor="newPassword">
        New Password
      </label>
      <input id="newPassword"
        type="password" name="newPassword"
        value={form.newPassword}
        onChange={onInputChange}
        placeholder="Enter new password" />
      <p>
        Min 8 chars: uppercase, lowercase,
        numbers
      </p>
    </div>
    <div>
      <label htmlFor="confirmPassword">
        Confirm New Password
      </label>
      <input id="confirmPassword"
        type="password" name="confirmPassword"
        value={form.confirmPassword}
        onChange={onInputChange}
        placeholder="Confirm new password" />
    </div>
    {error && <p>{error}</p>}
    <div>
      <button onClick={onSubmit}
        disabled={isChanging}>
        {isChanging
          ? 'Changing...'
          : 'Change Password'}
      </button>
      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  </div>
);

export default PasswordChangeForm;
