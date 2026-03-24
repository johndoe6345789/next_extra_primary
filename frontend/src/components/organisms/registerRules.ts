/**
 * Validation rules and types for registration.
 * @module components/organisms/registerRules
 */
import type { ValidationRules } from '@/hooks';
import React from 'react';

/** Validation rules for register fields. */
export const REG_RULES: ValidationRules = {
  username: [
    { required: true, message: 'Required' },
    { minLength: 3, message: 'Min 3 chars' },
  ],
  email: [
    { required: true, message: 'Required' },
    {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      message: 'Invalid email',
    },
  ],
  displayName: [
    { required: true, message: 'Required' },
  ],
  password: [
    { required: true, message: 'Required' },
    { minLength: 8, message: 'Min 8 chars' },
  ],
  confirmPassword: [
    { required: true, message: 'Required' },
  ],
};

/** Form field values shape. */
export interface RegFields {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

/** Change event type shorthand. */
export type CE = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/** Error map type shorthand. */
export type Errs =
  Record<string, string | undefined>;
