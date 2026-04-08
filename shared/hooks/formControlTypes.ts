'use client'

/**
 * Type definitions for FormControl component
 */

import React from 'react'

/** FormControl context value */
export interface FormControlContextValue {
  id?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  filled?: boolean
  focused?: boolean
}

/** Props for FormControl component */
export interface FormControlProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field has an error */
  error?: boolean
  /** Full width form control */
  fullWidth?: boolean
  /** Margin size */
  margin?: 'none' | 'dense' | 'normal'
  /** Size of the form control */
  size?: 'small' | 'medium'
  /** Visual variant */
  variant?:
    | 'standard'
    | 'outlined'
    | 'filled'
  /** Whether input has value */
  filled?: boolean
  /** Whether the input is focused */
  focused?: boolean
  /** MUI sx prop compatibility */
  sx?: Record<string, unknown>
}
