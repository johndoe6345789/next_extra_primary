/**
 * useWorkflow - React Hook for Workflow Execution
 *
 * Manages workflow execution state with retries.
 */

import {
  useState, useCallback, useRef, useEffect,
} from 'react'
import type {
  ExecuteWorkflowParams,
  WorkflowState,
  UseWorkflowOptions,
} from './workflowTypes'
import { isRetryableError } from './workflowTypes'
import type { ExecutionRecord } from '@shared/types'
import { useWorkflowPolling } from './workflowPolling'

export type { ExecuteWorkflowParams, WorkflowState, UseWorkflowOptions } from './workflowTypes'
export { useWorkflowExecutions } from './workflowExecutions'

/** React hook for workflow execution */
export function useWorkflow(
  options: UseWorkflowOptions = {}
) {
  const {
    onSuccess, onError, autoRetry = true,
    maxRetries = 3, retryDelay = 1000,
    liveUpdates = false,
  } = options

  const [state, setState] = useState<WorkflowState>({ status: 'idle' })
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const retryCount = useRef(0)
  const abortCtrl = useRef<AbortController | null>(null)
  const { pollStatus, stopPolling } = useWorkflowPolling(setState, setLoading)

  const execute = useCallback(async (params: ExecuteWorkflowParams): Promise<ExecutionRecord | null> => {
    try {
      setError(null); setLoading(true)
      setState((p) => ({ ...p, status: 'running', startTime: new Date() }))
      abortCtrl.current = new AbortController()
      const res = await fetch(`/api/v1/${params.tenant}/workflows/${params.workflowId}/execute`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerData: params.triggerData || {}, variables: params.variables || {}, request: params.request }),
        signal: abortCtrl.current.signal,
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || `API error: ${res.statusText}`) }
      const data = await res.json()
      setState({ executionId: data.executionId, status: data.status, state: data.state, metrics: data.metrics,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined, duration: data.duration })
      onSuccess?.(data)
      if (liveUpdates && data.status === 'running') pollStatus(params.tenant, data.executionId)
      retryCount.current = 0; setLoading(false); return data
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      if (autoRetry && retryCount.current < maxRetries && isRetryableError(e)) {
        retryCount.current++
        await new Promise((r) => setTimeout(r, retryDelay * retryCount.current))
        return execute(params)
      }
      setError(e); setState((p) => ({ ...p, status: 'error', error: e.message }))
      onError?.(e); setLoading(false); retryCount.current = 0; return null
    }
  }, [onSuccess, onError, autoRetry, maxRetries, retryDelay, liveUpdates, pollStatus])

  const cancel = useCallback(() => {
    abortCtrl.current?.abort()
    stopPolling()
    setLoading(false); setState((p) => ({ ...p, status: 'idle' }))
  }, [stopPolling])

  const reset = useCallback(() => {
    cancel(); setError(null); setState({ status: 'idle' }); retryCount.current = 0
  }, [cancel])

  useEffect(() => () => { cancel() }, [cancel])

  return {
    execute, cancel, reset, state, error, loading,
    executionId: state.executionId, status: state.status,
    result: state.state, metrics: state.metrics,
  }
}
