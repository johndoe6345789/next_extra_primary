/**
 * useFormField Hook
 * Individual form field state with validation
 */

import { useState, useCallback } from 'react'
import type {
  FieldConfig,
  UseFormFieldReturn,
} from './formFieldTypes'

export type {
  ValidationRule,
  FieldConfig,
  UseFormFieldReturn,
  FormConfig,
  UseFormReturn,
} from './formFieldTypes'

export { useForm } from './formSubmit'

/**
 * Hook for managing individual field state
 * @param config - Field configuration
 */
export function useFormField<T = unknown>(
  config: FieldConfig<T>
): UseFormFieldReturn<T> {
  const [value, setValue] =
    useState<T | undefined>(config.defaultValue)
  const [error, setError] =
    useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const validate = useCallback(() => {
    if (!config.rules || !touched) return true
    for (const rule of config.rules) {
      if (!rule.validate(value as T)) {
        setError(rule.message)
        return false
      }
    }
    setError(null)
    return true
  }, [value, config.rules, touched])

  const onChange = useCallback(
    (newValue: T) => {
      setValue(newValue)
      if (touched) setError(null)
    },
    [touched]
  )

  const onBlur = useCallback(() => {
    setTouched(true)
    validate()
  }, [validate])

  const reset = useCallback(() => {
    setValue(config.defaultValue)
    setError(null)
    setTouched(false)
  }, [config.defaultValue])

  return {
    value,
    error,
    touched,
    onChange,
    onBlur,
    reset,
    validate,
    isValid: error === null,
    isDirty: value !== config.defaultValue,
  }
}
