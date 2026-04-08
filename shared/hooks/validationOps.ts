'use client'

/**
 * Validation field and schema operations
 */

import { useCallback } from 'react'
import type {
  ValidationSchema,
  ValidationErrors,
} from './validationTypes'

/** Create field-level validation callback */
export function useFieldValidator<
  T extends Record<string, unknown>
>(
  schema: ValidationSchema<T>,
  setErrors: React.Dispatch<
    React.SetStateAction<ValidationErrors<T>>
  >
) {
  return useCallback(
    (field: keyof T, value: T[keyof T]): boolean => {
      const validator = schema[field]
      if (!validator) return true
      try {
        const err = validator(value)
        if (err) {
          setErrors((p) => ({ ...p, [field]: err }))
          return false
        }
        setErrors((p) => {
          const n = { ...p }
          delete n[field]
          return n
        })
        return true
      } catch (e) {
        const msg = e instanceof Error
          ? e.message : 'Validation error'
        setErrors((p) => ({ ...p, [field]: msg }))
        return false
      }
    },
    [schema, setErrors]
  )
}

/** Create full schema validation callback */
export function useSchemaValidator<
  T extends Record<string, unknown>
>(
  schema: ValidationSchema<T>,
  setErrors: React.Dispatch<
    React.SetStateAction<ValidationErrors<T>>
  >
) {
  return useCallback(
    (data: Partial<T>): boolean => {
      const newErrors: ValidationErrors<T> = {}
      for (const field in schema) {
        const value = data[field]
        if (value === undefined) continue
        const validator = schema[field]
        if (!validator) continue
        try {
          const err = validator(value)
          if (err) newErrors[field] = err
        } catch (e) {
          newErrors[field] = e instanceof Error
            ? e.message : 'Validation error'
        }
      }
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [schema, setErrors]
  )
}
