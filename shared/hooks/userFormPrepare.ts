'use client'

/**
 * Prepare + error handling for user form
 */

import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'

/** Prepare request data from form data */
export function prepareRequestData(
  data: UserFormData,
  isUpdate = false
) {
  return {
    username: data.username.trim(),
    email: data.email.trim(),
    role: data.role.toUpperCase(),
    ...(isUpdate
      ? data.bio !== undefined && {
          bio: data.bio.trim(),
        }
      : data.bio && { bio: data.bio.trim() }),
    ...(isUpdate
      ? data.profilePicture !== undefined && {
          profilePicture:
            data.profilePicture.trim(),
        }
      : data.profilePicture && {
          profilePicture:
            data.profilePicture.trim(),
        }),
  }
}

/** Handle API error responses */
export function handleApiErrors(
  response: Response,
  result: Record<string, unknown>,
  setErrors: (errors: UserFormErrors) => void
): Error {
  if (
    response.status === 422 &&
    (result.error as Record<string, unknown>)?.details
  ) {
    const fieldErrors: UserFormErrors = {}
    const details = (
      result.error as Record<string, unknown>
    ).details as Record<string, string>
    for (const [field, msg] of Object.entries(details)) {
      fieldErrors[field as keyof UserFormData] = msg
    }
    setErrors(fieldErrors)
    return new Error('Please fix validation errors')
  }
  if (response.status === 409) {
    const errObj = result.error as Record<string, unknown>
    return new Error(
      (errObj?.message as string) ??
      'This username or email already exists'
    )
  }
  if (response.status === 404) {
    return new Error('User not found')
  }
  const errObj = result.error as Record<string, unknown>
  return new Error(
    (errObj?.message as string) ??
    `HTTP ${response.status}: ${response.statusText}`
  )
}
