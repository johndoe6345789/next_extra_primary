'use client';

import React from 'react';
import TextField from '@shared/m3/TextField';
import type { RegisterFieldsProps }
  from './registerFormTypes';

export type {
  RegisterFieldsProps, RegFields,
} from './registerFormTypes';

/**
 * Five registration text fields.
 *
 * @param props - Component props.
 */
export const RegisterFormFields: React.FC<
  RegisterFieldsProps
> = ({ f, set, errors, labels }) => {
  const mm =
    f.confirmPassword.length > 0
    && f.password !== f.confirmPassword;
  return (
    <>
      <div className="form-field">
        <TextField
          label={labels.username}
          value={f.username}
          onChange={set('username')}
          required
          error={!!errors.username}
          helperText={errors.username}
          testId="register-username"
        />
      </div>
      <div className="form-field">
        <TextField
          label={labels.email}
          value={f.email}
          onChange={set('email')}
          type="email"
          required
          error={!!errors.email}
          helperText={errors.email}
          testId="register-email"
        />
      </div>
      <div className="form-field">
        <TextField
          label={labels.displayName}
          value={f.displayName}
          onChange={set('displayName')}
          required
          error={!!errors.displayName}
          helperText={errors.displayName}
          testId="register-displayname"
        />
      </div>
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

export default RegisterFormFields;
