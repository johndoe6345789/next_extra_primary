/**
 * Workflow write operations (create + update)
 */

import { useCallback } from 'react'
import type { Dispatch } from 'react'
import {
  updateWorkflowInList,
  setWorkflowsLoading,
  setWorkflowsError,
} from '@shared/redux-slices'
import { dbalFetch } from './workspaceDbal'
import type {
  UpdateWorkflowRequest,
} from './workflowsTypes'
export { useCreateWorkflow } from './workflowsCrudCreate'

/** Create workflow write handlers */
export function useWorkflowsWrite(
  dispatch: Dispatch<any>,
  success: (msg: string) => void,
  showErr: (msg: string) => void
) {
  const updateWorkflow = useCallback(
    async (
      id: string,
      data: UpdateWorkflowRequest
    ) => {
      dispatch(setWorkflowsLoading(true))
      dispatch(setWorkflowsError(null))
      try {
        const res = await dbalFetch<unknown>(
          'PUT',
          `default/core/workflow/${id}`,
          data
        )
        if (res) {
          dispatch(updateWorkflowInList(
            res as Parameters<
              typeof updateWorkflowInList
            >[0]
          ))
          success('Workflow updated!')
        }
        return res
      } catch (err) {
        const msg = err instanceof Error
          ? err.message : 'Failed to update'
        dispatch(setWorkflowsError(msg))
        showErr(msg)
        return null
      } finally {
        dispatch(setWorkflowsLoading(false))
      }
    },
    [dispatch, success, showErr]
  )

  return { updateWorkflow }
}
