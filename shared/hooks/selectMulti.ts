'use client'

/**
 * Multi-select logic for useSelect hook
 */

import { ChangeEvent } from 'react'
import type {
  SelectOption,
  UseSelectOptions,
  UseSelectMultiReturn,
} from './selectTypes'
import { createMultiSelectActions } from './selectMultiHandlers'

/** Build multi-select return value */
export function buildMultiSelect<T>(
  values: T[],
  initialValue: T[],
  options: UseSelectOptions<T, true>,
  error: string,
  isDirty: boolean,
  isTouched: boolean,
  searchTerm: string,
  filteredOptions: SelectOption<T>[],
  setValue: (v: T[]) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void,
  setSearchTerm: (v: string) => void
): UseSelectMultiReturn<T> {
  const acts = createMultiSelectActions(
    values, initialValue, options,
    setValue, setIsDirty, setIsTouched,
    setError, setSearchTerm
  )

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (opt) => {
        const m = options.options.find(
          (o) => o.label === opt.value
        )
        return m ? m.value : (opt.value as T)
      }
    )
    setValue(selected)
    setIsDirty(
      JSON.stringify(selected) !==
      JSON.stringify(initialValue)
    )
    if (error) setError('')
    if (options.onValidate) {
      const err = options.onValidate(
        selected as never
      )
      if (err) setError(err)
    }
    options.onChange?.(selected as never)
  }

  return {
    values, isDirty, isTouched, error,
    isValid: !error, searchTerm,
    filteredOptions, count: values.length,
    handlers: {
      onChange: handleChange,
      setValues: acts.setValues,
      isSelected: acts.isSelected,
      toggleOption: acts.toggleOption,
      addOption: acts.addOption,
      removeOption: acts.removeOption,
      clearAll: acts.clearAll,
      reset: acts.reset,
      touch: () => setIsTouched(true),
      validate: acts.validate,
      setError,
      clearError: () => setError(''),
      setSearchTerm,
    },
  }
}
