import React from 'react'
import { InputProps } from './InputTypes'

/**
 * Props for the TextField component
 */
export interface TextFieldProps
  extends Omit<
    InputProps,
    'size' | 'label' | 'helperText'
  > {
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  /** Render as select dropdown instead of input */
  select?: boolean
  /** Children (for select mode - MenuItem) */
  children?: React.ReactNode
  /** Render as textarea for multi-line input */
  multiline?: boolean
  /** Number of rows for multiline */
  rows?: number
  /** Props passed to the underlying input */
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement
  >
  /** Props passed to the helper text element */
  FormHelperTextProps?: Record<string, unknown>
  /** Input size */
  size?: 'small' | 'medium'
  /** Unique identifier for testing */
  testId?: string
  /** MUI sx prop for styling */
  sx?: Record<string, unknown>
}
