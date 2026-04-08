import React from 'react'

/**
 * Available icon sizes
 */
export type IconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'

/**
 * Available icon colors using M3 tokens
 */
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'onSurface'
  | 'onSurfaceVariant'
  | 'inverse'

/**
 * Available icon variants
 */
export type IconVariant =
  | 'filled'
  | 'filledTonal'
  | 'outlined'

/**
 * Props for the Icon component
 */
export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  /** Icon size */
  size?: IconSize
  /** Icon color using M3 color tokens */
  color?: IconColor
  /** Icon variant for background styling */
  variant?: IconVariant
  /** Whether the icon is disabled */
  disabled?: boolean
  /** Whether icon has button-like hover */
  button?: boolean
  /** @deprecated Use size="sm" instead */
  sm?: boolean
  /** @deprecated Use size="lg" instead */
  lg?: boolean
  /** Test ID for automated testing */
  testId?: string
}
