'use client';

import React, { useCallback } from 'react';
import { TextField } from '../atoms';
import { useFormValidation, type ValidationRule } from '@/hooks';

/**
 * Props for the FormField component.
 */
export interface FormFieldProps {
  /** Field name used as the validation key. */
  name: string;
  /** Label displayed on the text field. */
  label: string;
  /** Current field value. */
  value: string;
  /** Change handler for the field. */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  /** Validation rules applied on blur. */
  validationRules?: ValidationRule[];
  /** Whether to display error state. */
  showError?: boolean;
  /** HTML input type. */
  type?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Combines the TextField atom with inline validation.
 * Validates the field value on blur using the
 * provided rules and displays error feedback via
 * helperText. Links the error message to the input
 * through aria-describedby.
 *
 * @param props - Component props.
 * @returns The validated form field element.
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  validationRules = [],
  showError = true,
  type = 'text',
  required = false,
  testId = 'form-field',
}) => {
  const { validate, errors } = useFormValidation({
    [name]: validationRules,
  });

  const handleBlur = useCallback(() => {
    validate(name, value);
  }, [validate, name, value]);

  const errorMsg = errors[name];
  const hasError = showError && !!errorMsg;
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div data-testid={testId} onBlur={handleBlur}>
      <TextField
        id={fieldId}
        label={label}
        value={value}
        onChange={onChange}
        error={hasError}
        helperText={hasError ? errorMsg : undefined}
        type={type}
        required={required}
        testId={`${testId}-input`}
        inputProps={{
          'aria-describedby': hasError ? errorId : undefined,
          'aria-invalid': hasError,
        }}
      />
    </div>
  );
};

export default FormField;
