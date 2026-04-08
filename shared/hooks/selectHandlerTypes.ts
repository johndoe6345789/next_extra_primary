/**
 * Handler type definitions for useSelect hook
 */

import type { ChangeEvent } from 'react'
import type { SelectOption } from './selectTypes'

/** Handlers for single select */
export interface UseSelectSingleHandlers<T> {
  onChange: (
    e: ChangeEvent<HTMLSelectElement>
  ) => void
  setValue: (value: T | null) => void
  clear: () => void
  reset: () => void
  touch: () => void
  validate: () => boolean
  setError: (error: string) => void
  clearError: () => void
  setSearchTerm: (term: string) => void
  getOptionLabel: (value: T | null) => string
}

/** Handlers for multi-select */
export interface UseSelectMultiHandlers<T> {
  onChange: (
    e: ChangeEvent<HTMLSelectElement>
  ) => void
  setValues: (values: T[]) => void
  isSelected: (value: T) => boolean
  toggleOption: (value: T) => void
  addOption: (value: T) => void
  removeOption: (value: T) => void
  clearAll: () => void
  reset: () => void
  touch: () => void
  validate: () => boolean
  setError: (error: string) => void
  clearError: () => void
  setSearchTerm: (term: string) => void
}
