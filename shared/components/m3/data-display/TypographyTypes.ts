import React from 'react'

/**
 * Available typography variants
 */
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'overline'

/**
 * Props for the Typography component
 */
export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  variant?: TypographyVariant
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'inherit'
    | string
  align?: 'left' | 'center' | 'right' | 'justify'
  gutterBottom?: boolean
  noWrap?: boolean
  paragraph?: boolean
  as?: React.ElementType
  /** MUI-compatible alias for 'as' */
  component?: React.ElementType
  /** MUI sx prop for styling compatibility */
  sx?: Record<string, unknown>
  /** Test ID for automated testing */
  testId?: string
}
