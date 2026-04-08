/**
 * Form Validation Helpers
 * Validation and dirty-tracking logic
 * for the form builder hook.
 */

import { useCallback, useState } from 'react'
import type { ValidationErrors } from './formBuilderTypes'

/**
 * Create validation helpers for a form
 * @param validation - Validation function
 * @param values - Current form values
 * @returns Validate function and state
 */
export function useFormValidation<T>(
  validation:
    | ((values: T) => ValidationErrors<T>)
    | undefined,
  values: T
) {
  const [errors, setErrors] =
    useState<ValidationErrors<T>>({})
  const [isValidating, setIsValidating] =
    useState(false)

  /** @brief Run validation */
  const validate = useCallback(
    (
      v: T = values
    ): ValidationErrors<T> => {
      if (!validation) return {}
      setIsValidating(true)
      const errs = validation(v)
      setIsValidating(false)
      return errs
    },
    [validation, values]
  )

  return {
    errors,
    setErrors,
    isValidating,
    validate,
    isValid: Object.keys(errors).length === 0,
  }
}

/**
 * Compute dirty state for form fields
 * @param values - Current values
 * @param initial - Initial values
 * @returns isDirty flag and per-field dirty map
 */
export function computeDirtyState<
  T extends Record<string, any>
>(
  values: T,
  initial: T
): {
  isDirty: boolean
  dirty: Partial<Record<keyof T, boolean>>
} {
  const isDirty =
    JSON.stringify(values) !==
    JSON.stringify(initial)
  const dirty = Object.keys(values).reduce(
    (acc, key) => {
      const k = key as keyof T
      acc[k] = values[k] !== initial[k]
      return acc
    },
    {} as Partial<Record<keyof T, boolean>>
  )
  return { isDirty, dirty }
}
