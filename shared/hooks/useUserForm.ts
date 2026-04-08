'use client'

/**
 * useUserForm Hook
 *
 * Manages form state for creating/editing users.
 */

import type {
  UserFormData,
} from '@/lib/validation/user-validation'
import type {
  UseUserFormOptions,
  UseUserFormReturn,
} from './userFormTypes'
import { useUserFormState } from './userFormState'
import {
  useUserFormValidation,
} from './userFormValidation'
import {
  useUserFormSubmit,
} from './userFormSubmitters'

/** Hook for managing user form state */
export function useUserForm(
  options?: UseUserFormOptions
): UseUserFormReturn {
  const baseUrl = options?.baseUrl ?? ''
  const init = options?.initialData
  const initialFormData: UserFormData = {
    username: init?.username ?? '',
    email: init?.email ?? '',
    role: (init?.role as string) ?? 'user',
    bio: init?.bio ?? '',
    profilePicture: init?.profilePicture ?? '',
  }

  const s = useUserFormState(initialFormData)

  const { validateField, validateForm } =
    useUserFormValidation(
      s.formData, s.setErrors
    )

  const { submitCreate, submitUpdate } =
    useUserFormSubmit(
      baseUrl, s.formData, validateForm,
      s.setFormData, s.setErrors,
      s.setLoading, s.setSubmitError, options
    )

  return {
    formData: s.formData,
    errors: s.errors,
    loading: s.loading,
    submitError: s.submitError,
    isValid: s.isValid,
    isDirty: s.isDirty,
    handlers: {
      setField: s.setField,
      setErrors: s.setErrors,
      validateForm, validateField,
      submitCreate, submitUpdate,
      reset: s.reset,
    },
  }
}

export default useUserForm
