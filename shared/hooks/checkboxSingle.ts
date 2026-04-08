'use client'

/**
 * Single checkbox logic for useCheckbox hook
 */

import { ChangeEvent, useCallback } from 'react'
import type {
  UseCheckboxOptions,
  UseCheckboxSingleReturn,
} from './checkboxTypes'

/** Build single checkbox return value */
export function buildSingleCheckbox<T>(
  checked: boolean,
  initialValue: boolean,
  options: UseCheckboxOptions<T> | undefined,
  error: string,
  isDirty: boolean,
  isTouched: boolean,
  setValue: (v: boolean) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void
): UseCheckboxSingleReturn {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = e.target.checked
    setValue(newVal)
    setIsDirty(newVal !== initialValue)
    if (error) setError('')
    if (options?.onValidate) {
      const err = options.onValidate(newVal as T)
      if (err) setError(err)
    }
    options?.onChange?.(newVal as T)
  }

  const setChecked = (v: boolean) => {
    setValue(v)
    setIsDirty(v !== initialValue)
  }

  const toggle = () => {
    const next = !checked
    setChecked(next)
    options?.onChange?.(next as T)
  }

  const validate = (): boolean => {
    if (options?.onValidate) {
      const err = options.onValidate(checked as T)
      if (err) { setError(err); return false }
    }
    setError('')
    return true
  }

  return {
    checked, isDirty, isTouched, error,
    isValid: !error,
    handlers: {
      onChange: handleChange, setChecked, toggle,
      reset: () => {
        setValue(initialValue)
        setIsDirty(false)
        setIsTouched(false)
        setError('')
      },
      touch: () => setIsTouched(true),
      validate, setError,
      clearError: () => setError(''),
    },
  }
}
