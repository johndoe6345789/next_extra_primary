'use client'

/**
 * Multi-checkbox logic for useCheckbox hook
 */

import { ChangeEvent } from 'react'
import type {
  UseCheckboxOptions,
  UseCheckboxMultiReturn,
} from './checkboxTypes'
import { createCheckboxActions } from './checkboxMultiActions'

/** Build multi-checkbox return value */
export function buildMultiCheckbox<
  T extends Record<string, boolean>,
>(
  values: T,
  initialValue: T,
  options: UseCheckboxOptions<T> | undefined,
  error: string,
  isDirty: boolean,
  isTouched: boolean,
  setValue: (v: T) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void
): UseCheckboxMultiReturn<T> {
  const acts = createCheckboxActions(
    values, initialValue, options,
    setValue, setIsDirty, setIsTouched, setError
  )

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.name
    const newVal = {
      ...values, [name]: e.target.checked,
    } as T
    acts.setValues(newVal)
    if (error) setError('')
    if (options?.onValidate) {
      const err = options.onValidate(newVal)
      if (err) setError(err)
    }
    options?.onChange?.(newVal)
  }

  const count = Object.values(values)
    .filter((v) => v).length
  const total = Object.keys(values).length

  return {
    values, isDirty, isTouched, error,
    isValid: !error,
    count,
    isAllChecked: count === total && count > 0,
    isIndeterminate: count > 0 && count < total,
    handlers: {
      onChange: handleChange,
      setValues: acts.setValues,
      isChecked: acts.isChecked,
      toggle: acts.toggle,
      toggleAll: acts.toggleAll,
      uncheckAll: () => acts.toggleAll(false),
      checkAll: () => acts.toggleAll(true),
      reset: acts.reset,
      touch: () => setIsTouched(true),
      validate: acts.validate,
      setError,
      clearError: () => setError(''),
    },
  }
}
