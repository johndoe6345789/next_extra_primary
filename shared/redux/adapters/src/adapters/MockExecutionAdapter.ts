/**
 * MockExecutionServiceAdapter
 *
 * In-memory execution operations.
 */

import {
  IExecutionServiceAdapter,
  ExecutionResult,
} from '../types'
import {
  getExecutionStats,
  getExecutionHistory,
} from './MockExecutionQueries'

/** @brief In-memory execution operations */
export class MockExecutionServiceAdapter
  implements IExecutionServiceAdapter {
  private executions: Map<
    string,
    ExecutionResult
  > = new Map()

  /** @brief Execute a workflow (mock) */
  async executeWorkflow(
    workflowId: string,
    data: {
      nodes: any[]
      connections: any[]
      inputs?: Record<string, any>
    },
    tenantId?: string
  ): Promise<ExecutionResult> {
    const id = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const startTime = Date.now()
    const endTime = startTime + 1000
    const execution: ExecutionResult = {
      id,
      workflowId,
      workflowName: 'Test Workflow',
      status: 'success',
      startTime,
      endTime,
      duration: endTime - startTime,
      nodes: data.nodes.map((node) => ({
        nodeId: node.id,
        nodeName: node.name || node.type,
        status: 'success' as const,
        startTime,
        endTime,
        duration: endTime - startTime,
        output: {},
      })),
      input: data.inputs,
      output: {},
      tenantId: tenantId || 'test-tenant',
    }
    this.executions.set(execution.id, execution)
    return { ...execution }
  }

  /** @brief Cancel execution */
  async cancelExecution(
    executionId: string
  ): Promise<void> {
    const exec = this.executions.get(executionId)
    if (exec) {
      exec.status = 'stopped'
      exec.endTime = Date.now()
    }
  }

  /** @brief Get execution details */
  async getExecutionDetails(
    executionId: string
  ): Promise<ExecutionResult | null> {
    const exec = this.executions.get(executionId)
    return exec ? { ...exec } : null
  }

  getExecutionStats = getExecutionStats
  getExecutionHistory = getExecutionHistory
}
