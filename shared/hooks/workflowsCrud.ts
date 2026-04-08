/**
 * Workflow CRUD operations
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  removeWorkflowFromList,
  setWorkflowsLoading,
  setWorkflowsError,
} from '@shared/redux-slices'
import { useUINotifications } from './ui/useUINotifications'
import { dbalFetch } from './workspaceDbal'
import { useWorkflowsWrite } from './workflowsCrudWrite'
import { useCreateWorkflow } from './workflowsCrudCreate'

/** Create workflow CRUD handlers */
export function useWorkflowsCrud(
  dispatch: ReturnType<typeof useDispatch>,
  notifs: ReturnType<typeof useUINotifications>
) {
  const { success, error: showErr } = notifs
  const { updateWorkflow } =
    useWorkflowsWrite(dispatch, success, showErr)
  const createWorkflow =
    useCreateWorkflow(dispatch, success, showErr)

  const deleteWorkflow = useCallback(
    async (id: string) => {
      dispatch(setWorkflowsLoading(true))
      dispatch(setWorkflowsError(null))
      try {
        await dbalFetch<void>(
          'DELETE',
          `default/core/workflow/${id}`
        )
        dispatch(removeWorkflowFromList(id))
        success('Workflow deleted!')
        return true
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to delete'
        dispatch(setWorkflowsError(msg))
        showErr(msg)
        return false
      } finally {
        dispatch(setWorkflowsLoading(false))
      }
    },
    [dispatch, success, showErr]
  )

  return {
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  }
}
