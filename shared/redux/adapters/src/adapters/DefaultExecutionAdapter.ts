/**
 * DefaultExecutionServiceAdapter
 *
 * HTTP-based execution operations.
 */

import type {
  IExecutionServiceAdapter,
  ExecutionResult,
} from '../types'
import {
  getExecutionStats,
  getExecutionHistory,
} from './ExecutionQueries'

/** @brief HTTP adapter for workflow execution */
export class DefaultExecutionServiceAdapter
  implements IExecutionServiceAdapter {
  constructor(
    private apiBaseUrl: string = '/api'
  ) {}

  /** @brief Execute a workflow */
  async executeWorkflow(
    workflowId: string,
    data: {
      nodes: any[]
      connections: any[]
      inputs?: Record<string, any>
    },
    tenantId?: string
  ): Promise<ExecutionResult> {
    const url = new URL(
      `${this.apiBaseUrl}/workflows/${workflowId}/execute`,
      window.location.origin
    )
    if (tenantId) {
      url.searchParams.set('tenantId', tenantId)
    }
    const response = await fetch(
      url.toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) {
      throw new Error(
        'Failed to execute workflow'
      )
    }
    return response.json()
  }

  /** @brief Cancel a running execution */
  async cancelExecution(
    executionId: string
  ): Promise<void> {
    const url =
      `${this.apiBaseUrl}/executions/${executionId}/cancel`
    const response = await fetch(url, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(
        'Failed to cancel execution'
      )
    }
  }

  /** @brief Get execution details by ID */
  async getExecutionDetails(
    executionId: string
  ): Promise<ExecutionResult | null> {
    const url =
      `${this.apiBaseUrl}/executions/${executionId}`
    const response = await fetch(url)
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(
        'Failed to fetch execution details'
      )
    }
    return response.json()
  }

  getExecutionStats = getExecutionStats
  getExecutionHistory = getExecutionHistory
}
