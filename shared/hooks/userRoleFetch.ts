'use client'

/**
 * User role update fetch logic
 */

import type { User } from '@/lib/level-types'

const VALID_ROLES = [
  'public',
  'user',
  'moderator',
  'admin',
  'god',
  'supergod',
]

/**
 * Fetch to update a user's role
 * @param baseUrl - API base URL
 * @param userId - Target user ID
 * @param newRole - New role value
 * @returns Updated user data
 * @throws Error on invalid role or HTTP error
 */
export async function fetchUpdateRole(
  baseUrl: string,
  userId: string,
  newRole: string
): Promise<User> {
  if (!VALID_ROLES.includes(newRole)) {
    throw new Error(
      `Invalid role: ${newRole}`
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
      body: JSON.stringify({
        role: newRole.toUpperCase(),
      }),
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
