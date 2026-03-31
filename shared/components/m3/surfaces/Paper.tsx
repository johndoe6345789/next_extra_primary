'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  elevation?: number
  square?: boolean
  variant?: 'elevation' | 'outlined'
  sx?: Record<string, unknown>
  /** Render as different element */
  component?: React.ElementType
  /** Test ID for automated testing */
  testId?: string
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  ({ children, elevation = 1, square, variant = 'elevation', component: Component = 'div', className = '', sx, style, testId, ...props }, ref) => (
    <Component
      ref={ref}
      className={`paper paper--${variant} paper--elevation-${elevation} ${square ? 'paper--square' : ''} ${className}`}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  )
)

Paper.displayName = 'Paper'

export default Paper