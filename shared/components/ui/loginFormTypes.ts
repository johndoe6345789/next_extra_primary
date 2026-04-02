import React from 'react';

type Errs = Record<string, string | undefined>;

/** Labels needed by LoginForm. */
export interface LoginFormLabels {
  login: string;
  signingIn: string;
  forgotPassword: string;
  register: string;
  email: string;
  password: string;
}

/** Props for the LoginForm organism. */
export interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  pw: string;
  setPw: (v: string) => void;
  isLoading: boolean;
  errors: Errs;
  apiError: string | null;
  submit: (e: React.FormEvent) => void;
  labels: LoginFormLabels;
  links?: {
    forgotPassword?: string;
    register?: string;
  };
  testId?: string;
}
