'use client'

/**
 * Delete user action handler
 */

import { useCallback } from 'react'

interface DeleteOptions {
  baseUrl: string
  onSuccess?: (action: string) => void
  onError?: (action: string, error: string) => void
}

/** Create deleteUser handler */
export function useDeleteUser(
  opts: DeleteOptions,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
  setOp: (v: string) => void,
  setUserId: (v: string | null) => void
) {
  return useCallback(
    async (
      userId: string,
      force = false
    ): Promise<boolean> => {
      if (!force) {
        setError(
          'User deletion requires explicit ' +
          'confirmation'
        )
        return false
      }

      setLoading(true)
      setError(null)
      setOp('delete')
      setUserId(userId)

      try {
        const res = await fetch(
          `${opts.baseUrl}/api/v1/default/` +
          `user_manager/users/${userId}`,
          { method: 'DELETE' }
        )
        const result = await res.json()

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('User not found')
          }
          if (res.status === 403) {
            throw new Error(
              'No permission to delete this user'
            )
          }
          if (res.status === 409) {
            throw new Error(
              (result.error as Record<string, string>)
                ?.message ??
              'Cannot delete: has associated data'
            )
          }
          throw new Error(
            (result.error as Record<string, string>)
              ?.message ??
            `HTTP ${res.status}: ${res.statusText}`
          )
        }

        opts.onSuccess?.('deleteUser')
        return true
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to delete user'
        setError(msg)
        opts.onError?.('deleteUser', msg)
        return false
      } finally {
        setLoading(false)
        setOp('none')
        setUserId(null)
      }
    },
    [opts]
  )
}
