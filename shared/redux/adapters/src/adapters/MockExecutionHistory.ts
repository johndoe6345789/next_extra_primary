/**
 * MockExecutionHistory
 *
 * In-memory execution stats and history.
 */

import type {
  ExecutionResult,
  ExecutionStats,
} from '../types'

/** @brief Compute mock execution stats */
export function computeExecutionStats(
  executions: ExecutionResult[],
  workflowId: string
): ExecutionStats {
  const wfExecs = executions.filter(
    (e) => e.workflowId === workflowId
  )
  const successful = wfExecs.filter(
    (e) => e.status === 'success'
  )
  const failed = wfExecs.filter(
    (e) => e.status === 'error'
  )
  const durations = successful.map(
    (e) => (e.endTime || 0) - e.startTime
  )
  const avgDuration =
    durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) /
        durations.length
      : 0
  const lastExec = wfExecs[wfExecs.length - 1]

  return {
    totalExecutions: wfExecs.length,
    successfulExecutions: successful.length,
    failedExecutions: failed.length,
    averageDuration: avgDuration,
    lastExecutionTime: lastExec?.endTime,
  }
}

/** @brief Filter execution history */
export function filterExecutionHistory(
  executions: ExecutionResult[],
  workflowId: string,
  limit: number = 50
): ExecutionResult[] {
  return executions
    .filter(
      (e) => e.workflowId === workflowId
    )
    .slice(-limit)
    .map((e) => ({ ...e }))
}
