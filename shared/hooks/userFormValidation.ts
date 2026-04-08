'use client'

/**
 * User form field validation logic
 */

import { useCallback } from 'react'
import { validateUserForm } from '@/lib/validation/user-validation'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'

type SetErrors = React.Dispatch<
  React.SetStateAction<UserFormErrors>
>

/**
 * Build validation callbacks
 * @param formData - Current form data
 * @param setErrors - Errors state setter
 */
export function useUserFormValidation(
  formData: UserFormData,
  setErrors: SetErrors
) {
  const validateField = useCallback(
    (field: keyof UserFormData): boolean => {
      const errs = validateUserForm(
        { [field]: formData[field] },
        { singleField: field }
      )
      if (Object.keys(errs).length > 0) {
        setErrors((p) => ({ ...p, ...errs }))
        return false
      }
      setErrors((p) => {
        const n = { ...p }
        delete n[field]
        return n
      })
      return true
    },
    [formData]
  )

  const validateForm = useCallback(
    (): boolean => {
      const errs = validateUserForm(formData)
      setErrors(errs)
      return Object.keys(errs).length === 0
    },
    [formData]
  )

  return { validateField, validateForm }
}
