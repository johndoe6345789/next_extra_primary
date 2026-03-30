'use client';

import React from 'react';
import MuiTextField from '@metabuilder/m3/TextField';

/**
 * Props for the TextField component.
 */
export interface TextFieldProps {
  /** Label displayed above or inside the field */
  label: string;
  /** Current input value */
  value: string;
  /** Change handler */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  /** Whether the field is in an error state */
  error?: boolean;
  /** Helper or error text shown below the field */
  helperText?: string;
  /** HTML input type */
  type?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field spans full width */
  fullWidth?: boolean;
  /** Enables multiline textarea mode */
  multiline?: boolean;
  /** Number of rows for multiline mode */
  rows?: number;
  /** HTML autocomplete attribute */
  autoComplete?: string;
  /** Unique identifier for the field */
  id?: string;
  /** Field size variant */
  size?: 'small' | 'medium';
  /** data-testid attribute for testing */
  testId?: string;
  /** Additional input element props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * A text input component wrapping MUI TextField.
 * Automatically links helper text via
 * aria-describedby for accessibility.
 */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  type = 'text',
  required = false,
  fullWidth = true,
  multiline = false,
  rows,
  autoComplete,
  id,
  size,
  testId = 'text-field',
  inputProps,
}) => {
  const fieldId = id || `tf-${label.replace(/\s+/g, '-')}`;
  const helperId = `${fieldId}-helper`;

  return (
    <MuiTextField
      id={fieldId}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      required={required}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      autoComplete={autoComplete}
      size={size}
      inputProps={{
        'aria-describedby': helperText ? helperId : undefined,
        ...inputProps,
      }}
      FormHelperTextProps={{
        id: helperId,
      }}
      data-testid={testId}
    />
  );
};

export default TextField;
