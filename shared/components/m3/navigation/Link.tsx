'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'

export type LinkUnderline = 'none' | 'hover' | 'always'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode
  underline?: LinkUnderline
  color?: string
  /** Render as different element */
  component?: React.ElementType
  /** Typography variant for link text */
  variant?: string
  /** MUI sx prop for styling */
  sx?: Record<string, unknown>
  /** Test ID for automated testing */
  testId?: string
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, underline = 'hover', color, component: Component = 'a', variant, className = '', testId, sx, style, ...props }, ref) => (
    <Component
      ref={ref}
      className={`link link--underline-${underline} ${color ? `link--${color}` : ''} ${variant ? `link--${variant}` : ''} ${className}`}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  )
)

Link.displayName = 'Link'

export default Link