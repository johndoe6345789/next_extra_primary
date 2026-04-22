/**
 * Props interface for the TextField atom.
 * @module components/atoms/textFieldTypes
 */
import type React from 'react';

/**
 * Props for the TextField component.
 */
export interface TextFieldProps {
  /** Label displayed above or inside field */
  label: string;
  /** Current input value */
  value: string;
  /** Change handler */
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => void;
  /** Whether the field is in an error state */
  error?: boolean;
  /** Helper or error text below the field */
  helperText?: string;
  /** HTML input type */
  type?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether field spans full width */
  fullWidth?: boolean;
  /** Enables multiline textarea mode */
  multiline?: boolean;
  /** Number of rows for multiline mode */
  rows?: number;
  /** Minimum rows for multiline mode */
  minRows?: number;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** HTML autocomplete attribute */
  autoComplete?: string;
  /** Unique identifier for the field */
  id?: string;
  /** Field size variant */
  size?: 'small' | 'medium';
  /** Placeholder text (no floating label) */
  placeholder?: string;
  /** data-testid attribute for testing */
  testId?: string;
  /** Additional input element props */
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement
  >;
}
