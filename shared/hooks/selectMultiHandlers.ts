'use client'

/**
 * Multi-select action handlers
 */

import type {
  UseSelectOptions,
} from './selectTypes'
import {
  createMultiValidate,
  createMultiReset,
} from './selectMultiValidation'

/** Create multi-select action callbacks */
export function createMultiSelectActions<T>(
  values: T[],
  initialValue: T[],
  options: UseSelectOptions<T, true>,
  setValue: (v: T[]) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void,
  setSearchTerm: (v: string) => void
) {
  const setValues = (v: T[]) => {
    setValue(v)
    setIsDirty(
      JSON.stringify(v) !==
      JSON.stringify(initialValue)
    )
  }

  const isSelected = (val: T) =>
    values.includes(val)

  const toggleOption = (val: T) => {
    const next = isSelected(val)
      ? values.filter((v) => v !== val)
      : [...values, val]
    setValues(next)
    options.onChange?.(next as never)
  }

  const addOption = (val: T) => {
    if (!isSelected(val)) {
      const next = [...values, val]
      setValues(next)
      options.onChange?.(next as never)
    }
  }

  const removeOption = (val: T) => {
    if (isSelected(val)) {
      const next = values.filter(
        (v) => v !== val
      )
      setValues(next)
      options.onChange?.(next as never)
    }
  }

  const validate = createMultiValidate(
    values, options, setError
  )
  const clearAll = () => {
    setValues([])
    options.onChange?.([] as never)
  }
  const reset = createMultiReset(
    initialValue, setValue, setIsDirty,
    setIsTouched, setError, setSearchTerm
  )

  return {
    setValues, isSelected, toggleOption,
    addOption, removeOption, validate,
    clearAll, reset,
  }
}
