import React from 'react';

/** Field values shape for registration. */
export interface RegFields {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

type CE = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/** Labels needed by RegisterForm. */
export interface RegisterFormLabels {
  register: string;
  creating: string;
  hasAccount: string;
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  passwordsMustMatch: string;
}

/** Props for RegisterFormFields. */
export interface RegisterFieldsProps {
  f: RegFields;
  set: (k: string) => (e: CE) => void;
  errors: Record<string, string | undefined>;
  labels: RegisterFormLabels;
}

/** Props for the RegisterForm organism. */
export interface RegisterFormProps {
  f: RegFields;
  set: (k: string) => (e: CE) => void;
  isLoading: boolean;
  errors: Record<string, string | undefined>;
  apiError: string | null;
  submit: (e: React.FormEvent) => void;
  labels: RegisterFormLabels;
  links?: { login?: string };
  testId?: string;
}
