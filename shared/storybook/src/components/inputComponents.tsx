/**
 * Input/form components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export { Label, Textarea } from './inputExtras'

interface TextFieldProps extends ComponentProps {
  label?: string
  placeholder?: string
  type?: string
  fullWidth?: boolean
  size?: 'small' | 'medium'
}

/** Text input field. */
export const TextField: React.FC<
  TextFieldProps
> = ({
  label, placeholder, type = 'text',
  fullWidth = false, size = 'medium',
  className = '',
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
    <input
      type={type}
      placeholder={placeholder}
      className={
        'border rounded px-3'
        + ` ${size === 'small'
          ? 'py-1 text-sm' : 'py-2'}`
        + ` ${fullWidth ? 'w-full' : ''}`
      }
    />
  </div>
)

interface SelectProps extends ComponentProps {
  label?: string
  options?: Array<{
    value: string | number; label: string
  }> | Record<string, unknown>
}

/** Dropdown select. */
export const Select: React.FC<SelectProps> = ({
  label, options, className = '', children,
}) => {
  const arr = Array.isArray(options)
    ? options : []
  return (
    <div className={className}>
      {label && (
        <label className={
          'block text-sm font-medium mb-1'
        }>
          {label}
        </label>
      )}
      <select className={
        'border rounded px-3 py-2 w-full'
      }>
        {arr.map((opt, i) => (
          <option
            key={opt.value ?? i}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
        {children}
      </select>
    </div>
  )
}
