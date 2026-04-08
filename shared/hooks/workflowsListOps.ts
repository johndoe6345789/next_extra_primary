/**
 * Workflow list and get operations
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  setWorkflows, setWorkflowsLoading,
  setWorkflowsError,
} from '@shared/redux-slices'
import { dbalFetch } from './workspaceDbal'
import type {
  ListWorkflowsOptions,
} from './workflowsTypes'

/** Create list/get workflow handlers */
export function useWorkflowsListOps(
  dispatch: ReturnType<typeof useDispatch>
) {
  const listWorkflows = useCallback(
    async (opts: ListWorkflowsOptions = {}) => {
      dispatch(setWorkflowsLoading(true))
      dispatch(setWorkflowsError(null))
      try {
        const p: Record<string, string> = {}
        if (opts.status) p.status = opts.status
        if (opts.category) {
          p.category = opts.category
        }
        if (opts.isPublished !== undefined) {
          p.isPublished = String(opts.isPublished)
        }
        if (opts.limit) {
          p.limit = String(opts.limit)
        }
        if (opts.page) {
          p.page = String(opts.page)
        }
        const qs =
          new URLSearchParams(p).toString()
        const res = await dbalFetch<{
          data: unknown[]
          total: number
        }>(
          'GET',
          `default/core/workflow` +
            (qs ? `?${qs}` : '')
        )
        dispatch(
          setWorkflows(
            (res?.data ?? []) as Parameters<
              typeof setWorkflows
            >[0]
          )
        )
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to load workflows'
        dispatch(setWorkflowsError(msg))
      } finally {
        dispatch(setWorkflowsLoading(false))
      }
    },
    [dispatch]
  )

  const getWorkflow = useCallback(
    async (id: string) => {
      try {
        return await dbalFetch<unknown>(
          'GET',
          `default/core/workflow/${id}`
        )
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to load'
        dispatch(setWorkflowsError(msg))
        return null
      }
    },
    [dispatch]
  )

  return { listWorkflows, getWorkflow }
}
