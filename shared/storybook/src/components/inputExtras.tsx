/**
 * Extra input components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Standalone label. */
export const Label: React.FC<
  ComponentProps & { htmlFor?: string }
> = ({
  htmlFor, children,
  className = 'block text-sm font-medium mb-1',
}) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
)

/** Multiline textarea. */
export const Textarea: React.FC<
  ComponentProps & {
    label?: string; placeholder?: string
    rows?: number; fullWidth?: boolean
  }
> = ({
  label, placeholder, rows = 4,
  fullWidth = false, className = '',
}) => (
  <div className={
    `${fullWidth ? 'w-full' : ''} ${className}`
  }>
    {label && (
      <label className={
        'block text-sm font-medium mb-1'
      }>
        {label}
      </label>
    )}
    <textarea
      placeholder={placeholder}
      rows={rows}
      className={
        'border rounded px-3 py-2'
        + ` ${fullWidth ? 'w-full' : ''}`
      }
    />
  </div>
)
