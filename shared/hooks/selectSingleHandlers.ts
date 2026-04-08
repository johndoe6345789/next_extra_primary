'use client'

/**
 * Single-select validation and reset handlers
 */

import type {
  SelectOption,
  UseSelectOptions,
} from './selectTypes'

/**
 * Build getOptionLabel, validate, and reset
 * @param options - Select configuration
 * @param singleValue - Current value
 * @param initialValue - Starting value
 */
export function buildSingleHandlers<T>(
  options: UseSelectOptions<T, false>,
  singleValue: T | null,
  initialValue: T | null,
  setValue: (v: T | null) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void,
  setSearchTerm: (v: string) => void
) {
  const getOptionLabel = (
    val: T | null
  ): string => {
    if (val === null) return ''
    const opt = options.options.find(
      (o) => o.value === val
    )
    return opt?.label ?? String(val)
  }

  const validate = (): boolean => {
    if (options.onValidate) {
      const err = options.onValidate(
        singleValue as never
      )
      if (err) { setError(err); return false }
    }
    setError('')
    return true
  }

  const reset = () => {
    setValue(initialValue)
    setIsDirty(false)
    setIsTouched(false)
    setError('')
    setSearchTerm('')
  }

  return { getOptionLabel, validate, reset }
}
