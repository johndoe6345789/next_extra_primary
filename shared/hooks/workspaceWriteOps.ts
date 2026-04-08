/**
 * Workspace create/update/delete operations
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  addWorkspace as addWorkspaceAction,
  setWorkspaceLoading,
  setWorkspaceError,
} from '@shared/redux-slices'
import type { Workspace } from '@shared/types'
import { useUINotifications } from './ui/useUINotifications'
import { dbalFetch, getTenantId } from './workspaceDbal'
import type {
  CreateWorkspaceRequest,
} from './workspaceOperations'
import { useWorkspaceUpdate } from './workspaceUpdateOp'

/** Create workspace write handlers */
export function useWorkspaceWriteOps(
  dispatch: ReturnType<typeof useDispatch>,
  notifs: ReturnType<typeof useUINotifications>
) {
  const { success, error: showError } = notifs

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceRequest) => {
      dispatch(setWorkspaceLoading(true))
      try {
        const wData = {
          name: data.name,
          description: data.description || '',
          tenantId: getTenantId(),
          color: data.color || '#1976d2',
        }
        const res = await dbalFetch<Workspace>(
          'POST',
          'default/core/workspace',
          wData
        )
        if (!res) throw new Error('No response')
        dispatch(addWorkspaceAction(res))
        success(
          `Workspace "${data.name}" created!`
        )
        return res
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to create'
        dispatch(setWorkspaceError(msg))
        showError(msg)
        throw err
      } finally {
        dispatch(setWorkspaceLoading(false))
      }
    },
    [dispatch, success, showError]
  )

  const updateWorkspaceData =
    useWorkspaceUpdate(
      dispatch, success, showError
    )

  return { createWorkspace, updateWorkspaceData }
}
