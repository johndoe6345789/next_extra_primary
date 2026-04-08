'use client'

/**
 * Field array validation operations
 */

import { useCallback } from 'react'
import type {
  FormField,
  UseFieldArrayOptions,
} from './fieldArrayTypes'
import { useFieldArrayErrors } from './fieldArrayErrorOps'

/** Create validation handlers for fields */
export function useFieldArrayValidation<T>(
  fields: FormField<T>[],
  options: UseFieldArrayOptions<T> | undefined,
  setErrors: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >
) {
  /** Validate a single field */
  const validateField = useCallback(
    (index: number): boolean => {
      if (!options?.validateField) return true

      const field = fields[index]
      if (!field) return true

      const error = options.validateField(
        field.value,
        index
      )

      if (error) {
        setErrors((prev) => ({
          ...prev,
          [index]: error,
        }))
        return false
      }

      setErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      return true
    },
    [fields, options, setErrors]
  )

  /** Validate all fields */
  const validateAll = useCallback(
    (): boolean => {
      if (!options?.validateField) return true

      const newErrors: Record<number, string> =
        {}
      fields.forEach((field, index) => {
        const error = options.validateField!(
          field.value,
          index
        )
        if (error) newErrors[index] = error
      })

      setErrors(newErrors)
      return (
        Object.keys(newErrors).length === 0
      )
    },
    [fields, options, setErrors]
  )

  const errorOps =
    useFieldArrayErrors(setErrors)

  return {
    validateField,
    validateAll,
    ...errorOps,
  }
}
