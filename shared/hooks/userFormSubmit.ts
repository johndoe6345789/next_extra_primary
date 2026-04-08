'use client'

/**
 * Submit handlers for useUserForm hook
 */

import type { User } from '@/lib/level-types'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'
import {
  prepareRequestData,
  handleApiErrors,
} from './userFormPrepare'

export { prepareRequestData, handleApiErrors } from './userFormPrepare'

/** Submit create user request */
export async function submitCreateRequest(
  baseUrl: string,
  data: UserFormData,
  setErrors: (errors: UserFormErrors) => void
): Promise<User> {
  const requestData = prepareRequestData(data)
  const response = await fetch(
    `${baseUrl}/api/v1/default/user_manager/users`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    }
  )
  const result = await response.json()
  if (!response.ok) {
    throw handleApiErrors(response, result, setErrors)
  }
  return result.data as User
}

/** Submit update user request */
export async function submitUpdateRequest(
  baseUrl: string,
  userId: string,
  data: UserFormData,
  setErrors: (errors: UserFormErrors) => void
): Promise<User> {
  const requestData = prepareRequestData(data, true)
  const response = await fetch(
    `${baseUrl}/api/v1/default/user_manager/users/${userId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    }
  )
  const result = await response.json()
  if (!response.ok) {
    throw handleApiErrors(response, result, setErrors)
  }
  return result.data as User
}
