import type React from 'react'

/** Account form data shape. */
export interface AccountFormData {
  fullName: string;
  email: string;
  username: string;
  bio: string;
}

/** Props for AccountFormFields. */
export interface AccountFormFieldsProps {
  formData: AccountFormData;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement
      | HTMLTextAreaElement
    >
  ) => void;
}
