import React from 'react'

/**
 * Badge color options
 */
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'surface'
  | 'default'

/**
 * Badge size options
 */
export type BadgeSize = 'sm' | 'md' | 'lg'

/**
 * Badge position options
 */
export type BadgePosition =
  | 'topRight'
  | 'topLeft'
  | 'bottomRight'
  | 'bottomLeft'
  | 'inline'

/**
 * Badge variant options
 */
export type BadgeVariant =
  | 'standard'
  | 'dot'
  | 'outlined'
  | 'outline'
  | 'secondary'
  | 'filled'
  | 'tonal'
  | 'danger'

/**
 * Overlap shape options
 */
export type OverlapShape =
  | 'circular'
  | 'rectangular'

/**
 * Props for the Badge component
 */
export interface BadgeProps
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    'color' | 'content'
  > {
  children?: React.ReactNode
  content?: React.ReactNode
  /** Test ID for automated testing */
  testId?: string
  dot?: boolean
  invisible?: boolean
  max?: number
  color?: BadgeColor
  size?: BadgeSize
  position?: BadgePosition
  variant?: BadgeVariant
  overlap?: OverlapShape
  pulse?: boolean
}
