'use client'

/**
 * Type definitions for useInput hook
 */

import { ChangeEvent, FocusEvent } from 'react'

/** Options for useInput hook */
export interface UseInputOptions {
  /** Initial value for the input */
  initialValue?: string
  /** Callback when input changes */
  onChange?: (value: string) => void
  /** Callback when input blurs */
  onBlur?: (value: string) => void
  /** Validate: returns error or empty string */
  onValidate?: (value: string) => string
  /** Trim whitespace on change */
  trim?: boolean
  /** Transform value on change */
  transform?: (value: string) => string
}

/** Internal state of useInput */
export interface UseInputState {
  value: string
  isDirty: boolean
  isTouched: boolean
  error: string
  isValid: boolean
}

/** Handler functions returned by useInput */
export interface UseInputHandlers {
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void
  onBlur: (
    e: FocusEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void
  setValue: (value: string) => void
  setError: (error: string) => void
  clearError: () => void
  reset: () => void
  touch: () => void
  validate: () => boolean
}

/** Full return type of useInput */
export interface UseInputReturn
  extends UseInputState {
  handlers: UseInputHandlers
}
