'use client'

/**
 * User form update submission
 */

import { useCallback } from 'react'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'
import { submitUpdateRequest } from './userFormSubmit'

type SetState<T> = React.Dispatch<
  React.SetStateAction<T>
>

/** Build submitUpdate callback */
export function useUserFormUpdate(
  baseUrl: string,
  formData: UserFormData,
  validateForm: () => boolean,
  setErrors: SetState<UserFormErrors>,
  setLoading: SetState<boolean>,
  setSubmitError: SetState<string | null>,
  options?: {
    onSuccess?: (u: unknown) => void
    onError?: (msg: string) => void
  }
) {
  return useCallback(
    async (
      userId: string,
      data?: UserFormData
    ) => {
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
          await submitUpdateRequest(
            baseUrl, userId, d, setErrors
          )
        options?.onSuccess?.(user)
        return user
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to update user'
        setSubmitError(msg)
        options?.onError?.(msg)
        return null
      } finally { setLoading(false) }
    },
    [formData, validateForm, options]
  )
}
