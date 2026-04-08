/**
 * Workflow create operation
 */

import { useCallback } from 'react'
import type { Dispatch } from 'react'
import {
  addWorkflowToList,
  setWorkflowsLoading,
  setWorkflowsError,
} from '@shared/redux-slices'
import { dbalFetch, getTenantId } from './workspaceDbal'
import type {
  CreateWorkflowRequest,
} from './workflowsTypes'

/** Generate a workflow ID from name */
function genWorkflowId(name: string): string {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `workflow_${base}_${Date.now()}`
}

/** Create workflow handler */
export function useCreateWorkflow(
  dispatch: Dispatch<any>,
  success: (msg: string) => void,
  showErr: (msg: string) => void
) {
  return useCallback(
    async (data: CreateWorkflowRequest) => {
      dispatch(setWorkflowsLoading(true))
      dispatch(setWorkflowsError(null))
      try {
        const now = Date.now()
        const wfData = {
          id: genWorkflowId(data.name),
          name: data.name,
          description: data.description || '',
          version: data.version || '1.0.0',
          category: data.category || 'custom',
          status: data.status || 'draft',
          nodes: data.nodes || [],
          connections: data.connections || {},
          metadata: data.metadata || {},
          isPublished: false,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
          tenantId: getTenantId(),
        }
        const res = await dbalFetch<unknown>(
          'POST',
          'default/core/workflow',
          wfData
        )
        if (res) {
          dispatch(addWorkflowToList(
            res as Parameters<
              typeof addWorkflowToList
            >[0]
          ))
          success(
            `Workflow "${data.name}" created!`
          )
        }
        return res
      } catch (err) {
        const msg = err instanceof Error
          ? err.message : 'Failed to create'
        dispatch(setWorkflowsError(msg))
        showErr(msg)
        return null
      } finally {
        dispatch(setWorkflowsLoading(false))
      }
    },
    [dispatch, success, showErr]
  )
}
