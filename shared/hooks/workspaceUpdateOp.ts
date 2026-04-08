/**
 * Workspace update operation
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateWorkspace as updateWorkspaceAction,
  setWorkspaceLoading,
  setWorkspaceError,
} from '@shared/redux-slices'
import type { Workspace } from '@shared/types'
import { dbalFetch } from './workspaceDbal'
import type {
  UpdateWorkspaceRequest,
} from './workspaceOperations'

/** Create updateWorkspaceData handler */
export function useWorkspaceUpdate(
  dispatch: ReturnType<typeof useDispatch>,
  success: (msg: string) => void,
  showError: (msg: string) => void
) {
  return useCallback(
    async (
      id: string,
      data: UpdateWorkspaceRequest
    ) => {
      dispatch(setWorkspaceLoading(true))
      try {
        const res = await dbalFetch<Workspace>(
          'PUT',
          `default/core/workspace/${id}`,
          data
        )
        if (!res) throw new Error('No response')
        dispatch(updateWorkspaceAction(res))
        success('Workspace updated!')
        return res
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to update'
        dispatch(setWorkspaceError(msg))
        showError(msg)
        throw err
      } finally {
        dispatch(setWorkspaceLoading(false))
      }
    },
    [dispatch, success, showError]
  )
}
