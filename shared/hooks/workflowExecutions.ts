/**
 * useWorkflowExecutions Hook
 *
 * Lists workflow execution history.
 */

import {
  useState, useCallback, useEffect, useRef,
} from 'react'
import type { ExecutionRecord } from '@shared/types'

/**
 * Hook to list workflow executions
 */
export function useWorkflowExecutions(
  tenant: string,
  workflowId: string,
  options: {
    limit?: number
    autoRefresh?: boolean
  } = {}
) {
  const { limit = 50, autoRefresh = false } = options
  const [executions, setExecutions] =
    useState<ExecutionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<Error | null>(null)
  const refreshRef =
    useRef<NodeJS.Timeout | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/v1/${tenant}/workflows/` +
        `${workflowId}/executions?limit=${limit}`
      )
      if (res.ok) {
        const data = await res.json()
        setExecutions(data.executions || [])
        setError(null)
      } else {
        throw new Error(
          `Failed to fetch executions: ` +
          `${res.statusText}`
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(String(err))
      )
    } finally {
      setLoading(false)
    }
  }, [tenant, workflowId, limit])

  useEffect(() => {
    refresh()
    if (autoRefresh) {
      refreshRef.current = setInterval(
        refresh, 5000
      )
    }
    return () => {
      if (refreshRef.current) {
        clearInterval(refreshRef.current)
      }
    }
  }, [refresh, autoRefresh])

  return { executions, loading, error, refresh }
}
