'use client'

/**
 * useSelect Hook
 *
 * Manages select/dropdown state for single
 * and multi-select inputs.
 */

import { useState } from 'react'
import type {
  UseSelectOptions,
  UseSelectSingleReturn,
  UseSelectMultiReturn,
} from './selectTypes'
import { buildMultiSelect } from './selectMulti'
import { buildSingleSelect } from './selectSingle'
import {
  useFilteredOptions,
} from './useSelectFilter'

export type { SelectOption } from './selectTypes'

/** Hook for managing single select state */
export function useSelect<T = string>(
  initialValue: T | null,
  options: UseSelectOptions<T, false>
): UseSelectSingleReturn<T>

/** Hook for managing multi-select state */
export function useSelect<T = string>(
  initialValue: T[],
  options: UseSelectOptions<T, true>
): UseSelectMultiReturn<T>

/** Implementation */
export function useSelect<
  T = string,
  Multiple extends boolean = false,
>(
  initialValue: Multiple extends true
    ? T[] : T | null,
  options: UseSelectOptions<T, Multiple>
): UseSelectSingleReturn<T> |
   UseSelectMultiReturn<T> {
  const isMulti = options.isMulti ?? false
  const [value, setValue] =
    useState(initialValue)
  const [isDirty, setIsDirty] = useState(false)
  const [isTouched, setIsTouched] =
    useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] =
    useState('')

  const filtered = useFilteredOptions(
    options.options,
    options.searchable,
    searchTerm
  )

  if (isMulti) {
    return buildMultiSelect(
      value as T[], initialValue as T[],
      options as UseSelectOptions<T, true>,
      error, isDirty, isTouched,
      searchTerm, filtered(),
      (v) => setValue(v as typeof value),
      setIsDirty, setIsTouched,
      setError, setSearchTerm
    )
  }

  return buildSingleSelect(
    value as T | null,
    initialValue as T | null,
    options as UseSelectOptions<T, false>,
    error, isDirty, isTouched,
    searchTerm, filtered(),
    (v) => setValue(v as typeof value),
    setIsDirty, setIsTouched,
    setError, setSearchTerm
  )
}

export default useSelect
