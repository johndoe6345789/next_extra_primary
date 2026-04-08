'use client'

/**
 * useUserActions Hook
 *
 * Manages individual user operations like delete,
 * role updates, and status changes.
 */

import { useCallback, useState } from 'react'
import { useDeleteUser } from './userActionsDelete'
import { useUpdateUserRole, useUpdateUserStatus } from './userActionsUpdate'
import type { User } from '@/lib/level-types'

type OperationType =
  | 'delete'
  | 'updateRole'
  | 'updateStatus'
  | 'none'

interface UseUserActionsOptions {
  baseUrl?: string
  onSuccess?: (action: string, user?: User) => void
  onError?: (action: string, error: string) => void
}

/** Hook for managing individual user operations */
export function useUserActions(
  options?: UseUserActionsOptions
) {
  const baseUrl = options?.baseUrl ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<string | null>(null)
  const [op, setOp] =
    useState<OperationType>('none')
  const [affectedUserId, setAffectedUserId] =
    useState<string | null>(null)

  const opts = {
    baseUrl,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  }

  const deleteUser = useDeleteUser(
    opts, setLoading, setError,
    setOp as (v: string) => void,
    setAffectedUserId
  )

  const updateUserRole = useUpdateUserRole(
    opts, setLoading, setError,
    setOp as (v: string) => void,
    setAffectedUserId
  )

  const updateUserStatus = useUpdateUserStatus(
    opts, setLoading, setError,
    setOp as (v: string) => void,
    setAffectedUserId
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading, error,
    operationInProgress: op,
    affectedUserId,
    handlers: {
      deleteUser, updateUserRole,
      updateUserStatus, clearError,
    },
  }
}

export default useUserActions
