'use client'

/**
 * User form state initialization
 */

import { useCallback, useState } from 'react'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'

/** Initialize user form state */
export function useUserFormState(
  initialFormData: UserFormData
) {
  const [formData, setFormData] =
    useState<UserFormData>(initialFormData)
  const [errors, setErrors] =
    useState<UserFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] =
    useState<string | null>(null)

  const isDirty =
    JSON.stringify(formData) !==
    JSON.stringify(initialFormData)
  const isValid =
    Object.keys(errors).length === 0 &&
    !!formData.username &&
    !!formData.email

  const setField = useCallback(
    (
      name: keyof UserFormData,
      value: unknown
    ) => {
      setFormData((p) => ({
        ...p, [name]: value,
      }))
      setErrors((p) => {
        const n = { ...p }
        delete n[name]
        return n
      })
    },
    []
  )

  const reset = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setSubmitError(null)
  }, [initialFormData])

  return {
    formData, setFormData,
    errors, setErrors,
    loading, setLoading,
    submitError, setSubmitError,
    isDirty, isValid,
    setField, reset,
  }
}
