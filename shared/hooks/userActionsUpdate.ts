'use client'

/**
 * Update user role action handler
 */

import { useCallback } from 'react'
import type { User } from '@/lib/level-types'
import { fetchUpdateRole } from './userRoleFetch'

export { useUpdateUserStatus } from './userActionsStatus'

interface UpdateOptions {
  baseUrl: string
  onSuccess?: (
    action: string,
    user?: User
  ) => void
  onError?: (
    action: string,
    error: string
  ) => void
}

/** Create updateUserRole handler */
export function useUpdateUserRole(
  opts: UpdateOptions,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
  setOp: (v: string) => void,
  setUserId: (v: string | null) => void
) {
  return useCallback(
    async (userId: string, newRole: string) => {
      setLoading(true)
      setError(null)
      setOp('updateRole')
      setUserId(userId)
      try {
        const user = await fetchUpdateRole(
          opts.baseUrl, userId, newRole
        )
        opts.onSuccess?.(
          'updateUserRole',
          user
        )
        return user
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to update role'
        setError(msg)
        opts.onError?.(
          'updateUserRole',
          msg
        )
        return null
      } finally {
        setLoading(false)
        setOp('none')
        setUserId(null)
      }
    },
    [
      opts, setLoading, setError,
      setOp, setUserId,
    ]
  )
}
