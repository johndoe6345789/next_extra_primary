import React from 'react'

/**
 * Props for InputLabel component (MUI-compatible)
 */
export interface InputLabelProps
  extends React.LabelHTMLAttributes<
    HTMLLabelElement
  > {
  testId?: string
  children?: React.ReactNode
  /** Whether the label should be shrunk */
  shrink?: boolean
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field has an error */
  error?: boolean
  /** Visual variant */
  variant?: 'standard' | 'outlined' | 'filled'
  /** Size of the label */
  size?: 'small' | 'medium'
  /** MUI sx prop for styling compatibility */
  sx?: Record<string, unknown>
}
