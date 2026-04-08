'use client'

/**
 * Type definitions for useValidation hook
 */

/**
 * Validation schema: field -> validator
 * Validator receives value, returns error or ''
 */
export type ValidationSchema<
  T extends Record<string, unknown>
> = {
  [K in keyof T]?: (value: T[K]) => string
}

/** Validation errors by field name */
export type ValidationErrors<
  T extends Record<string, unknown>
> = Partial<Record<keyof T, string>>

/** Return type of useValidation hook */
export interface UseValidationReturn<
  T extends Record<string, unknown>
> {
  errors: ValidationErrors<T>
  isValid: boolean
  hasError: (field: keyof T) => boolean
  getFieldError: (
    field: keyof T
  ) => string | undefined
  validate: (data: Partial<T>) => boolean
  validateField: (
    field: keyof T,
    value: T[keyof T]
  ) => boolean
  setFieldError: (
    field: keyof T,
    error: string
  ) => void
  setErrors: (
    errors: ValidationErrors<T>
  ) => void
  clearError: (field: keyof T) => void
  clearErrors: () => void
}
