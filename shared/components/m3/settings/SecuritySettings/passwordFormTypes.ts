import type React from 'react'

/** Shape of the password change form state. */
export interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Props for the PasswordChangeForm. */
export interface PasswordChangeFormProps {
  form: PasswordFormState;
  error: string;
  isChanging: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
