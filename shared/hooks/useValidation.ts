'use client'

/**
 * useValidation Hook
 * Schema-based form validation
 */

import { useCallback, useState } from 'react'
import type {
  ValidationSchema,
  ValidationErrors,
  UseValidationReturn,
} from './validationTypes'
import { useFieldValidator, useSchemaValidator } from './validationOps'

export type {
  ValidationSchema,
  ValidationErrors,
  UseValidationReturn,
} from './validationTypes'

/**
 * Hook for schema-based form validation
 * @param schema - Field validators
 */
export function useValidation<
  T extends Record<string, unknown>
>(schema: ValidationSchema<T>): UseValidationReturn<T> {
  const [errors, setErrors] =
    useState<ValidationErrors<T>>({})
  const isValid = Object.keys(errors).length === 0

  const hasError = useCallback(
    (field: keyof T) => Boolean(errors[field]), [errors]
  )
  const getFieldError = useCallback(
    (field: keyof T) => errors[field], [errors]
  )

  const validateField = useFieldValidator(schema, setErrors)
  const validate = useSchemaValidator(schema, setErrors)

  const setFieldError = useCallback(
    (field: keyof T, error: string) => {
      setErrors((p) => ({ ...p, [field]: error }))
    }, []
  )
  const clearError = useCallback(
    (field: keyof T) => {
      setErrors((p) => { const n = { ...p }; delete n[field]; return n })
    }, []
  )
  const clearErrors = useCallback(() => setErrors({}), [])

  return {
    errors, isValid, hasError, getFieldError,
    validate, validateField, setFieldError,
    setErrors, clearError, clearErrors,
  }
}

export default useValidation
