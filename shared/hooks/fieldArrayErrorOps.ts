'use client'

/**
 * Field array error management operations
 */

import { useCallback } from 'react'

/** Create error management handlers */
export function useFieldArrayErrors(
  setErrors: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >
) {
  /** Set error for a specific field */
  const setFieldError = useCallback(
    (index: number, error: string) => {
      setErrors((prev) => ({
        ...prev,
        [index]: error,
      }))
    },
    [setErrors]
  )

  /** Clear error for a specific field */
  const clearFieldError = useCallback(
    (index: number) => {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    },
    [setErrors]
  )

  /** Clear all errors */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [setErrors])

  return {
    setFieldError,
    clearFieldError,
    clearErrors,
  }
}
