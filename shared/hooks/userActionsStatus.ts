'use client'

/**
 * Update user status action handler
 */

import { useCallback } from 'react'
import type { User } from '@/lib/level-types'
import { fetchUpdateStatus } from './userStatusFetch'

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

/** Create updateUserStatus handler */
export function useUpdateUserStatus(
  opts: UpdateOptions,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
  setOp: (v: string) => void,
  setUserId: (v: string | null) => void
) {
  return useCallback(
    async (userId: string, status: string) => {
      setLoading(true)
      setError(null)
      setOp('updateStatus')
      setUserId(userId)
      try {
        const user = await fetchUpdateStatus(
          opts.baseUrl, userId, status
        )
        opts.onSuccess?.(
          'updateUserStatus',
          user
        )
        return user
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to update status'
        setError(msg)
        opts.onError?.(
          'updateUserStatus',
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
