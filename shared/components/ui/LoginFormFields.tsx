'use client';

import React from 'react';
import TextField from '@shared/m3/TextField';

type Errs = Record<string, string | undefined>;

/** Props for LoginFormFields. */
export interface LoginFieldsProps {
  /** Email value. */
  email: string;
  /** Password value. */
  pw: string;
  /** Email setter. */
  setEmail: (v: string) => void;
  /** Password setter. */
  setPw: (v: string) => void;
  /** Validation errors. */
  errors: Errs;
  /** Labels and placeholders. */
  labels: { email: string; password: string };
}

type CE = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/**
 * Email and password fields for login form.
 *
 * @param props - Component props.
 */
export const LoginFormFields: React.FC<
  LoginFieldsProps
> = ({ email, pw, setEmail, setPw, errors, labels }) => (
  <>
    <div className="form-field">
      <TextField
        label={labels.email}
        value={email}
        onChange={(e: CE) => setEmail(e.target.value)}
        type="email"
        required
        error={!!errors.email}
        helperText={errors.email}
        autoComplete="email"
        testId="login-email"
      />
    </div>
    <div className="form-field">
      <TextField
        label={labels.password}
        value={pw}
        onChange={(e: CE) => setPw(e.target.value)}
        type="password"
        required
        error={!!errors.password}
        helperText={errors.password}
        autoComplete="current-password"
        testId="login-password"
      />
    </div>
  </>
);

export default LoginFormFields;
