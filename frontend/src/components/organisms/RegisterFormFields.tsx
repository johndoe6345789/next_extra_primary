'use client';

import React from 'react';
import { TextField } from '../atoms';
import type {
  RegFields, CE, Errs,
} from './registerRules';

/** Props for RegisterFormFields. */
export interface RegisterFieldsProps {
  f: RegFields;
  set: (k: string) => (e: CE) => void;
  errors: Errs;
}

/**
 * Five registration text fields extracted
 * from RegisterForm for the 100-LOC limit.
 */
export const RegisterFormFields: React.FC<
  RegisterFieldsProps
> = ({ f, set, errors }) => {
  const mm =
    f.confirmPassword.length > 0
    && f.password !== f.confirmPassword;
  return (
    <>
      <TextField
        label="Username" value={f.username}
        onChange={set('username')} required
        error={!!errors.username}
        helperText={errors.username}
        testId="register-username"
      />
      <TextField
        label="Email" value={f.email}
        onChange={set('email')} type="email"
        required error={!!errors.email}
        helperText={errors.email}
        testId="register-email"
      />
      <TextField
        label="Display Name"
        value={f.displayName}
        onChange={set('displayName')} required
        error={!!errors.displayName}
        helperText={errors.displayName}
        testId="register-displayname"
      />
      <TextField
        label="Password" value={f.password}
        onChange={set('password')}
        type="password" required
        error={!!errors.password}
        helperText={errors.password}
        testId="register-password"
      />
      <TextField
        label="Confirm Password"
        value={f.confirmPassword}
        onChange={set('confirmPassword')}
        type="password" required
        error={!!errors.confirmPassword || mm}
        helperText={
          errors.confirmPassword
          ?? (mm ? 'Passwords must match' : '')
        }
        testId="register-confirm"
      />
    </>
  );
};
