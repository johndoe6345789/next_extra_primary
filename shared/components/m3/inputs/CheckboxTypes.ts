import React from 'react'

/**
 * Available checkbox colors
 */
export type CheckboxColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'

/**
 * Available checkbox sizes
 */
export type CheckboxSize = 'sm' | 'md' | 'lg'

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size'
  > {
  label?: React.ReactNode
  color?: CheckboxColor
  size?: CheckboxSize
  error?: boolean
  indeterminate?: boolean
  /** Unique identifier for testing */
  testId?: string
}
