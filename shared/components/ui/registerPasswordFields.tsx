'use client';

import React from 'react';
import TextField from '@shared/m3/TextField';
import type { RegFields } from './registerFormTypes';

/** Props for password field pair. */
export interface RegisterPasswordFieldsProps {
  /** Form fields state. */
  f: RegFields;
  /** Field setter function. */
  set: (
    field: keyof RegFields,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Validation errors. */
  errors: Partial<Record<keyof RegFields, string>>;
  /** Translated labels. */
  labels: {
    password: string;
    confirmPassword: string;
    passwordsMustMatch: string;
  };
}

/**
 * Password and confirm-password fields
 * with mismatch detection.
 *
 * @param props - Component props.
 */
export const RegisterPasswordFields: React.FC<
  RegisterPasswordFieldsProps
> = ({ f, set, errors, labels }) => {
  const mm =
    f.confirmPassword.length > 0
    && f.password !== f.confirmPassword;
  return (
    <>
      <div className="form-field">
        <TextField
          label={labels.password}
          value={f.password}
          onChange={set('password')}
          type="password"
          required
          error={!!errors.password}
          helperText={errors.password}
          testId="register-password"
        />
      </div>
      <div className="form-field">
        <TextField
          label={labels.confirmPassword}
          value={f.confirmPassword}
          onChange={set('confirmPassword')}
          type="password"
          required
          error={!!errors.confirmPassword || mm}
          helperText={
            errors.confirmPassword
            ?? (mm ? labels.passwordsMustMatch : '')
          }
          testId="register-confirm"
        />
      </div>
    </>
  );
};

export default RegisterPasswordFields;
