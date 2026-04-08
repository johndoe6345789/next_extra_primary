import React from 'react'

/**
 * Valid button variants - maps to Material button types
 */
export type ButtonVariant =
  | 'text'
  | 'outlined'
  | 'filled'
  | 'tonal'
  | 'elevated'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'contained'

/**
 * Valid button sizes
 */
export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'small'
  | 'medium'
  | 'large'

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<
    HTMLButtonElement
  > {
  children?: React.ReactNode
  /** Button style variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** MUI-style color prop */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'inherit'
    | 'onPrimary'
  /** @deprecated Use variant="filled" instead */
  primary?: boolean
  /** @deprecated Use variant="tonal" instead */
  secondary?: boolean
  /** @deprecated Use variant="outlined" instead */
  outline?: boolean
  /** @deprecated Use variant="text" instead */
  ghost?: boolean
  /** @deprecated Use size="sm" instead */
  sm?: boolean
  /** @deprecated Use size="lg" instead */
  lg?: boolean
  /** Icon-only button styling */
  icon?: boolean
  /** Show loading spinner and disable */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
  /** Start icon element */
  startIcon?: React.ReactNode
  /** End icon element */
  endIcon?: React.ReactNode
  /** Unique identifier for testing */
  testId?: string
  /** MUI-style sx prop for inline styles */
  sx?: Record<string, unknown>
  /** Render as different element */
  component?: React.ElementType
  /** URL for link buttons */
  href?: string
  /** Edge alignment for icon buttons */
  edge?: 'start' | 'end' | false
}
