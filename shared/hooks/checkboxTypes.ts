/**
 * Type definitions for useCheckbox hook
 */

import type { ChangeEvent } from 'react'

/** Configuration options for checkbox hook */
export interface UseCheckboxOptions<T> {
  /** Callback when checkbox state changes */
  onChange?: (value: T) => void
  /** Validation function */
  onValidate?: (value: T) => string
  /** Reset value on submit */
  resetOnSubmit?: boolean
}

/** State for single checkbox */
export interface UseCheckboxSingleState {
  checked: boolean
  isDirty: boolean
  isTouched: boolean
  error: string
  isValid: boolean
}

/** State for multiple checkboxes */
export interface UseCheckboxMultiState<
  T extends Record<string, boolean>,
> {
  values: T
  isDirty: boolean
  isTouched: boolean
  error: string
  isValid: boolean
  count: number
  isAllChecked: boolean
  isIndeterminate: boolean
}

/** Handlers for single checkbox */
export interface UseCheckboxSingleHandlers {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  setChecked: (checked: boolean) => void
  toggle: () => void
  reset: () => void
  touch: () => void
  validate: () => boolean
  setError: (error: string) => void
  clearError: () => void
}

/** Handlers for multiple checkboxes */
export interface UseCheckboxMultiHandlers<
  T extends Record<string, boolean>,
> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  setValues: (values: T) => void
  isChecked: (field: keyof T) => boolean
  toggle: (field: keyof T) => void
  toggleAll: (checked: boolean) => void
  uncheckAll: () => void
  checkAll: () => void
  reset: () => void
  touch: () => void
  validate: () => boolean
  setError: (error: string) => void
  clearError: () => void
}

/** Single checkbox return type */
export interface UseCheckboxSingleReturn
  extends UseCheckboxSingleState {
  handlers: UseCheckboxSingleHandlers
}

/** Multiple checkboxes return type */
export interface UseCheckboxMultiReturn<
  T extends Record<string, boolean>,
> extends UseCheckboxMultiState<T> {
  handlers: UseCheckboxMultiHandlers<T>
}
