/**
 * Execution query methods - stats and history.
 * Mixed into DefaultExecutionServiceAdapter.
 */

import type {
  ExecutionResult,
  ExecutionStats,
} from '../types'

/** @brief Get execution statistics */
export async function getExecutionStats(
  this: { apiBaseUrl: string },
  workflowId: string,
  tenantId?: string
): Promise<ExecutionStats> {
  const url = new URL(
    `${this.apiBaseUrl}/workflows/${workflowId}/stats`,
    window.location.origin
  )
  if (tenantId) {
    url.searchParams.set('tenantId', tenantId)
  }
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error('Failed')
  return r.json()
}

/** @brief Get execution history */
export async function getExecutionHistory(
  this: { apiBaseUrl: string },
  workflowId: string,
  tenantId?: string,
  limit = 50
): Promise<ExecutionResult[]> {
  const url = new URL(
    `${this.apiBaseUrl}/workflows/${workflowId}/history`,
    window.location.origin
  )
  if (tenantId) {
    url.searchParams.set('tenantId', tenantId)
  }
  url.searchParams.set('limit', String(limit))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error('Failed')
  return r.json()
}
