import React from 'react';

/** Labels needed by ForgotPasswordForm. */
export interface ForgotPasswordLabels {
  resetPassword: string;
  resetInstructions: string;
  email: string;
  sending: string;
  resetSent: string;
  backToLogin: string;
}

/** Props for ForgotPasswordForm. */
export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (v: string) => void;
  isLoading: boolean;
  success: boolean;
  apiError: string | null;
  submit: (e: React.FormEvent) => void;
  labels: ForgotPasswordLabels;
  links?: { login?: string };
  testId?: string;
}
