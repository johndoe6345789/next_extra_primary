'use client';

import React from 'react';
import { TextField } from '../atoms';

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
}

/**
 * Email and password fields for login form.
 * Extracted sub-component.
 */
export const LoginFormFields: React.FC<
  LoginFieldsProps
> = ({ email, pw, setEmail, setPw, errors }) => (
  <>
    <TextField
      label="Email" value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email" required
      error={!!errors.email}
      helperText={errors.email}
      autoComplete="email"
      testId="login-email"
    />
    <TextField
      label="Password" value={pw}
      onChange={(e) => setPw(e.target.value)}
      type="password" required
      error={!!errors.password}
      helperText={errors.password}
      autoComplete="current-password"
      testId="login-password"
    />
  </>
);
