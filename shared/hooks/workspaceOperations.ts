/**
 * Workspace CRUD operations
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  removeWorkspace,
  setWorkspaceLoading,
  setWorkspaceError,
} from '@shared/redux-slices'
import { useUINotifications } from './ui/useUINotifications'
import { dbalFetch } from './workspaceDbal'
import { useWorkspaceWriteOps } from './workspaceWriteOps'
import { useSwitchWorkspace } from './workspaceSwitchOp'

export interface CreateWorkspaceRequest {
  name: string
  description?: string
  tenantId?: string
  color?: string
  [key: string]: unknown
}

export interface UpdateWorkspaceRequest {
  name?: string
  description?: string
  [key: string]: unknown
}

/** Create workspace CRUD handlers */
export function useWorkspaceOps(
  dispatch: ReturnType<typeof useDispatch>,
  notifs: ReturnType<typeof useUINotifications>
) {
  const { success, error: showError } = notifs

  const {
    createWorkspace,
    updateWorkspaceData,
  } = useWorkspaceWriteOps(dispatch, notifs)

  const deleteWorkspace = useCallback(
    async (id: string) => {
      dispatch(setWorkspaceLoading(true))
      try {
        await dbalFetch<void>(
          'DELETE',
          `default/core/workspace/${id}`
        )
        dispatch(removeWorkspace(id))
        success('Workspace deleted!')
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to delete'
        dispatch(setWorkspaceError(msg))
        showError(msg)
        throw err
      } finally {
        dispatch(setWorkspaceLoading(false))
      }
    },
    [dispatch, success, showError]
  )

  const switchWorkspace =
    useSwitchWorkspace(dispatch)

  return {
    createWorkspace,
    updateWorkspaceData,
    deleteWorkspace,
    switchWorkspace,
  }
}
