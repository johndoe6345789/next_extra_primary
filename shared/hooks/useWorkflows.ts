/**
 * useWorkflows Hook
 * Manages workflow list via DBAL REST API + Redux.
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useUINotifications } from './ui/useUINotifications'
import {
  selectWorkflows,
  selectWorkflowsIsLoading,
  selectWorkflowsError,
  setWorkflowsError,
  type WorkflowsState,
} from '@shared/redux-slices'
import { useWorkflowsCrud } from './workflowsCrud'
import { useWorkflowsListOps } from './workflowsListOps'

export type {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsOptions,
} from './workflowsTypes'

interface RootState {
  workflows: WorkflowsState
}

export function useWorkflows() {
  const dispatch = useDispatch()
  const notifs = useUINotifications()

  const workflows = useSelector(
    (s: RootState) => selectWorkflows(s)
  )
  const isLoading = useSelector(
    (s: RootState) => selectWorkflowsIsLoading(s)
  )
  const error = useSelector(
    (s: RootState) => selectWorkflowsError(s)
  )

  const { listWorkflows, getWorkflow } =
    useWorkflowsListOps(dispatch)
  const crud = useWorkflowsCrud(dispatch, notifs)

  const executeWorkflow = useCallback(
    async (id: string) => {
      try {
        const execId =
          `exec_${id}_${Date.now()}`
        return {
          executionId: execId,
          status: 'simulated',
        }
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to execute'
        dispatch(setWorkflowsError(msg))
        return null
      }
    },
    [dispatch]
  )

  return {
    workflows, isLoading, error,
    listWorkflows, getWorkflow,
    ...crud, executeWorkflow,
  }
}

export default useWorkflows
