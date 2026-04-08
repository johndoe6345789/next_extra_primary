'use client'

/**
 * User status update fetch logic
 */

import type { User } from '@/lib/level-types'

const VALID_STATUSES = [
  'active',
  'suspended',
  'inactive',
]

/**
 * Fetch to update a user's status
 * @param baseUrl - API base URL
 * @param userId - Target user ID
 * @param status - New status value
 * @returns Updated user data
 * @throws Error on invalid status or HTTP error
 */
export async function fetchUpdateStatus(
  baseUrl: string,
  userId: string,
  status: string
): Promise<User> {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      `Invalid status: ${status}`
    )
  }
  const res = await fetch(
    `${baseUrl}/api/v1/default/` +
      `user_manager/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }
  )
  const result = await res.json()
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('User not found')
    }
    if (res.status === 403) {
      throw new Error('No permission')
    }
    throw new Error(
      (
        result.error as Record<string, string>
      )?.message ?? `HTTP ${res.status}`
    )
  }
  return result.data as User
}
