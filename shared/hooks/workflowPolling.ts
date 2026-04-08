/**
 * Workflow execution status polling
 */

import { useCallback, useRef } from 'react'
import type { WorkflowState } from './workflowTypes'

/** Create a workflow poll callback */
export function useWorkflowPolling(
  setState: React.Dispatch<
    React.SetStateAction<WorkflowState>
  >,
  setLoading: (v: boolean) => void
) {
  const pollRef =
    useRef<NodeJS.Timeout | null>(null)

  const pollStatus = useCallback(
    (tenant: string, execId: string) => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
      pollRef.current = setInterval(
        async () => {
          try {
            const url =
              `/api/v1/${tenant}` +
              `/workflows/executions/${execId}`
            const res = await fetch(url)
            if (res.ok) {
              const d = await res.json()
              setState({
                executionId: d.id,
                status: d.status,
                state: d.state,
                metrics: d.metrics,
                startTime: d.startTime
                  ? new Date(d.startTime)
                  : undefined,
                endTime: d.endTime
                  ? new Date(d.endTime)
                  : undefined,
                duration: d.duration,
              })
              if (
                d.status === 'success' ||
                d.status === 'error'
              ) {
                if (pollRef.current) {
                  clearInterval(pollRef.current)
                  pollRef.current = null
                }
                setLoading(false)
              }
            }
          } catch (err) {
            console.error('Poll error:', err)
          }
        },
        1000
      )
    },
    [setState, setLoading]
  )

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  return { pollStatus, stopPolling }
}
