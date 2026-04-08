'use client'

/**
 * Single-select logic for useSelect hook
 */

import { ChangeEvent } from 'react'
import type {
  SelectOption,
  UseSelectOptions,
  UseSelectSingleReturn,
} from './selectTypes'
import {
  buildSingleHandlers,
} from './selectSingleHandlers'

/** Build single-select return value */
export function buildSingleSelect<T>(
  singleValue: T | null,
  initialValue: T | null,
  options: UseSelectOptions<T, false>,
  error: string,
  isDirty: boolean,
  isTouched: boolean,
  searchTerm: string,
  filteredOptions: SelectOption<T>[],
  setValue: (v: T | null) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void,
  setSearchTerm: (v: string) => void
): UseSelectSingleReturn<T> {
  const handleChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const sel = e.target.value
    const matched = options.options.find(
      (o) => o.label === sel
    )
    const newVal: T | null = matched
      ? matched.value
      : (sel as T)
    setValue(newVal)
    setIsDirty(newVal !== initialValue)
    if (error) setError('')
    if (options.onValidate) {
      const err = options.onValidate(
        newVal as never
      )
      if (err) setError(err)
    }
    options.onChange?.(newVal as never)
  }

  const setProgVal = (v: T | null) => {
    setValue(v)
    setIsDirty(v !== initialValue)
  }

  const helpers = buildSingleHandlers(
    options, singleValue, initialValue,
    setValue, setIsDirty, setIsTouched,
    setError, setSearchTerm
  )

  return {
    value: singleValue,
    isDirty, isTouched, error,
    isValid: !error,
    searchTerm, filteredOptions,
    handlers: {
      onChange: handleChange,
      setValue: setProgVal,
      clear: () => {
        setProgVal(null)
        options.onChange?.(null as never)
      },
      reset: helpers.reset,
      touch: () => setIsTouched(true),
      validate: helpers.validate,
      setError,
      clearError: () => setError(''),
      setSearchTerm,
      getOptionLabel: helpers.getOptionLabel,
    },
  }
}
