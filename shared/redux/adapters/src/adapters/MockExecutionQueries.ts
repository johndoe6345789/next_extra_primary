/**
 * MockExecutionServiceAdapter query mixins.
 * Stats and history methods for the mock
 * execution adapter.
 */

import type {
  ExecutionResult,
  ExecutionStats,
} from '../types'
import {
  computeExecutionStats,
  filterExecutionHistory,
} from './MockExecutionHistory'

type ExecMap = Map<string, ExecutionResult>

/** @brief Get execution statistics */
export async function getExecutionStats(
  this: { executions: ExecMap },
  workflowId: string,
  _tenantId?: string
): Promise<ExecutionStats> {
  const allExecs = Array.from(
    this.executions.values()
  )
  return computeExecutionStats(
    allExecs, workflowId
  )
}

/** @brief Get execution history */
export async function getExecutionHistory(
  this: { executions: ExecMap },
  workflowId: string,
  _tenantId?: string,
  limit: number = 50
): Promise<ExecutionResult[]> {
  const allExecs = Array.from(
    this.executions.values()
  )
  return filterExecutionHistory(
    allExecs, workflowId, limit
  )
}
