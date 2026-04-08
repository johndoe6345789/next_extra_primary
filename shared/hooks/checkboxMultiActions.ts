'use client'

/**
 * Multi-checkbox action handlers
 */

import type {
  UseCheckboxOptions,
} from './checkboxTypes'

/** Create multi-checkbox action callbacks */
export function createCheckboxActions<
  T extends Record<string, boolean>,
>(
  values: T,
  initialValue: T,
  options: UseCheckboxOptions<T> | undefined,
  setValue: (v: T) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void
) {
  const setValues = (v: T) => {
    setValue(v)
    setIsDirty(
      JSON.stringify(v) !==
      JSON.stringify(initialValue)
    )
  }

  const isChecked = (
    field: string | number | symbol
  ) => values[field as string] ?? false

  const toggle = (
    field: string | number | symbol
  ) => {
    const next = {
      ...values,
      [field]: !values[field as string],
    } as T
    setValues(next)
    options?.onChange?.(next)
  }

  const toggleAll = (checked: boolean) => {
    const next = Object.keys(values).reduce(
      (acc, key) => {
        acc[key] = checked
        return acc
      },
      { ...values } as Record<string, boolean>
    ) as T
    setValues(next)
    options?.onChange?.(next)
  }

  const validate = (): boolean => {
    if (options?.onValidate) {
      const err = options.onValidate(values)
      if (err) {
        setError(err)
        return false
      }
    }
    setError('')
    return true
  }

  const reset = () => {
    setValue(initialValue)
    setIsDirty(false)
    setIsTouched(false)
    setError('')
  }

  return {
    setValues,
    isChecked,
    toggle,
    toggleAll,
    validate,
    reset,
  }
}
