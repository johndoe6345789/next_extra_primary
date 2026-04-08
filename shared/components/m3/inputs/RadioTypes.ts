import React from 'react'

/**
 * Available radio button colors
 */
export type RadioColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'

/**
 * Available radio button sizes
 */
export type RadioSize = 'sm' | 'md' | 'lg'

/**
 * Props for the Radio component
 */
export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size'
  > {
  testId?: string
  /** Label text for the radio button */
  label?: React.ReactNode
  /** Color variant */
  color?: RadioColor
  /** Size variant */
  size?: RadioSize
  /** Error state */
  error?: boolean
  /** Disable ripple effect */
  disableRipple?: boolean
}
