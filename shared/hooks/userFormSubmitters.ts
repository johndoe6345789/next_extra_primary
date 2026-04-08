'use client'

/**
 * User form create submission
 */

import { useCallback } from 'react'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'
import { submitCreateRequest } from './userFormSubmit'
import { DEFAULT_FORM_DATA } from './userFormTypes'
import { useUserFormUpdate } from './userFormUpdate'

type SetState<T> = React.Dispatch<
  React.SetStateAction<T>
>

/** Build create/update submit callbacks */
export function useUserFormSubmit(
  baseUrl: string,
  formData: UserFormData,
  validateForm: () => boolean,
  setFormData: SetState<UserFormData>,
  setErrors: SetState<UserFormErrors>,
  setLoading: SetState<boolean>,
  setSubmitError: SetState<string | null>,
  options?: {
    onSuccess?: (u: unknown) => void
    onError?: (msg: string) => void
  }
) {
  const submitCreate = useCallback(
    async (data?: UserFormData) => {
      const d = data ?? formData
      if (!validateForm()) {
        setSubmitError(
          'Please fix validation errors'
        )
        return null
      }
      setLoading(true)
      setSubmitError(null)
      try {
        const user =
          await submitCreateRequest(
            baseUrl, d, setErrors
          )
        options?.onSuccess?.(user)
        setFormData(DEFAULT_FORM_DATA)
        return user
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to create user'
        setSubmitError(msg)
        options?.onError?.(msg)
        return null
      } finally { setLoading(false) }
    },
    [formData, validateForm, options]
  )

  const submitUpdate = useUserFormUpdate(
    baseUrl, formData, validateForm,
    setErrors, setLoading,
    setSubmitError, options
  )

  return { submitCreate, submitUpdate }
}
