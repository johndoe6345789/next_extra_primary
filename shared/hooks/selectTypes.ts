/**
 * Type definitions for useSelect hook
 */

import type {
  UseSelectSingleHandlers,
  UseSelectMultiHandlers,
} from './selectHandlerTypes'

export type {
  UseSelectSingleHandlers,
  UseSelectMultiHandlers,
} from './selectHandlerTypes'

/** Option structure */
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  group?: string
}

/** Configuration options for select hook */
export interface UseSelectOptions<
  T,
  Multiple extends boolean = false,
> {
  /** Available options */
  options: SelectOption<T>[]
  /** Enable multi-select */
  isMulti?: Multiple
  /** Callback when value changes */
  onChange?: (
    value: Multiple extends true ? T[] : T
  ) => void
  /** Validation function */
  onValidate?: (
    value: Multiple extends true ? T[] : T
  ) => string
  /** Allow clearing selection */
  clearable?: boolean
  /** Allow searching/filtering options */
  searchable?: boolean
}

/** State for single select */
export interface UseSelectSingleState<T> {
  value: T | null
  isDirty: boolean
  isTouched: boolean
  error: string
  isValid: boolean
  searchTerm: string
  filteredOptions: SelectOption<T>[]
}

/** State for multi-select */
export interface UseSelectMultiState<T> {
  values: T[]
  isDirty: boolean
  isTouched: boolean
  error: string
  isValid: boolean
  searchTerm: string
  filteredOptions: SelectOption<T>[]
  count: number
}

/** Single select return type */
export interface UseSelectSingleReturn<T>
  extends UseSelectSingleState<T> {
  handlers: UseSelectSingleHandlers<T>
}

/** Multi-select return type */
export interface UseSelectMultiReturn<T>
  extends UseSelectMultiState<T> {
  handlers: UseSelectMultiHandlers<T>
}
