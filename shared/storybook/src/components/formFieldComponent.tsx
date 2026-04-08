/**
 * Form field wrapper component for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Form field wrapper. */
export const FormField: React.FC<
  ComponentProps & {
    label?: string; error?: string
    required?: boolean; helperText?: string
  }
> = ({
  label, error, required, helperText,
  children, className = 'mb-4',
}) => (
  <div className={className}>
    {label && (
      <label className={
        'block text-sm font-medium mb-1'
      }>
        {label}
        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>
    )}
    {children}
    {helperText && !error && (
      <p className={
        'text-xs text-muted-foreground mt-1'
      }>
        {helperText}
      </p>
    )}
    {error && (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
)

/** Conditional render (always shows). */
export const ConditionalRender: React.FC<
  ComponentProps
> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)
