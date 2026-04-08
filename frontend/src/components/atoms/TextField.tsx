'use client';

import React from 'react';
import MuiTextField from '@shared/m3/TextField';
import type { TextFieldProps } from
  './textFieldTypes';

export type { TextFieldProps } from
  './textFieldTypes';

/**
 * A text input component wrapping MUI TextField.
 * Automatically links helper text via
 * aria-describedby for accessibility.
 */
export const TextField: React.FC<
  TextFieldProps
> = ({
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
  placeholder,
  testId = 'text-field',
  inputProps,
}) => {
  const fieldId =
    id || `tf-${label.replace(/\s+/g, '-')}`;
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
      placeholder={placeholder}
      inputProps={{
        'aria-describedby': helperText
          ? helperId : undefined,
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
