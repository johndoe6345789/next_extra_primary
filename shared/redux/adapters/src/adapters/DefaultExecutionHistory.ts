/**
 * Default execution stats and history
 *
 * Provides stats and history methods for
 * DefaultExecutionServiceAdapter.
 */

import type {
  ExecutionResult,
  ExecutionStats,
} from '../types'

/** @brief Fetch execution stats for a workflow */
export async function getExecutionStats(
  apiBaseUrl: string,
  workflowId: string,
  tenantId?: string
): Promise<ExecutionStats> {
  const params = new URLSearchParams()
  if (tenantId) {
    params.set('tenantId', tenantId)
  }
  const url =
    `${apiBaseUrl}/workflows/${workflowId}/execution-stats?${params}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      'Failed to fetch execution stats'
    )
  }
  return response.json()
}

/** @brief Fetch execution history */
export async function getExecutionHistory(
  apiBaseUrl: string,
  workflowId: string,
  tenantId?: string,
  limit: number = 50
): Promise<ExecutionResult[]> {
  const params = new URLSearchParams({
    limit: Math.min(limit, 100).toString(),
  })
  if (tenantId) {
    params.set('tenantId', tenantId)
  }
  const url =
    `${apiBaseUrl}/workflows/${workflowId}/execution-history?${params}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      'Failed to fetch execution history'
    )
  }
  const data = await response.json()
  return data.executions || []
}
