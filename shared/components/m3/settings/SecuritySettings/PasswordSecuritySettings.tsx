'use client';
/** PasswordSecuritySettings - Password change */

import React from 'react';
import { PasswordChangeForm }
  from './PasswordChangeForm';
import { usePasswordSecurity }
  from './usePasswordSecurity';

/**
 * Password change management section.
 */
export const PasswordSecuritySettings: React.FC<{
  onPasswordChanged?: () => void;
  testId?: string;
}> = ({ onPasswordChanged, testId }) => {
  const pw = usePasswordSecurity(
    onPasswordChanged
  );

  return (
    <div data-testid={testId}>
      <h3>Change Password</h3>
      <p>
        Keep your account secure with a strong
        password
      </p>
      {!pw.showForm ? (
        <button
          onClick={() => pw.setShowForm(true)}>
          Change Password
        </button>
      ) : (
        <PasswordChangeForm
          form={pw.form}
          error={pw.error}
          isChanging={pw.isChanging}
          onInputChange={pw.handleInputChange}
          onSubmit={pw.handleChangePassword}
          onCancel={() =>
            pw.setShowForm(false)} />
      )}
    </div>
  );
};

export default PasswordSecuritySettings;
