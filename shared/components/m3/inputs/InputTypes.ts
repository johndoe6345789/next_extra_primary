import React from 'react'

/**
 * Valid input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size'
  > {
  testId?: string
  /** Input size */
  size?: InputSize
  /** @deprecated Use size="sm" instead */
  sm?: boolean
  /** @deprecated Use size="md" instead */
  md?: boolean
  /** @deprecated Use size="lg" instead */
  lg?: boolean
  /** Error state styling */
  error?: boolean
  /** Error message to display */
  errorMessage?: string
  /** Label for the input */
  label?: string
  /** Helper text displayed below input */
  helperText?: string
  /** Full width input */
  fullWidth?: boolean
  /** Start adornment element */
  startAdornment?: React.ReactNode
  /** End adornment element */
  endAdornment?: React.ReactNode
}

/**
 * Get size class from props
 */
export const getSizeClass = (
  props: InputProps
): string => {
  if (props.size) return `input--${props.size}`
  if (props.sm) return 'input--sm'
  if (props.lg) return 'input--lg'
  if (props.md) return 'input--md'
  return ''
}
