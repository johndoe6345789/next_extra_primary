'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';

/** Props for the login error alert. */
export interface LoginErrorAlertProps {
  /** Error message to display. */
  apiError: string;
  /** Optional error code. */
  errorCode?: string;
}

/**
 * Displays API error with optional error code.
 *
 * @param props - Component props.
 */
export const LoginErrorAlert: React.FC<
  LoginErrorAlertProps
> = ({ apiError, errorCode }) => (
  <Alert severity="error" testId="login-error">
    {apiError}
    {errorCode && (
      <span
        style={{
          display: 'block',
          fontSize: '0.75rem',
          opacity: 0.7,
          fontFamily: 'monospace',
          marginTop: 4,
        }}
        data-testid="login-error-code"
      >
        Code: {errorCode}
      </span>
    )}
  </Alert>
);

export default LoginErrorAlert;
