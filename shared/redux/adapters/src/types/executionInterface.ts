/**
 * Execution Service Adapter Interface
 * Contract for execution implementations
 */

import type {
  ExecutionResult,
  ExecutionStats,
} from '@shared/types'

/** @brief Execution service contract */
export interface IExecutionServiceAdapter {
  executeWorkflow(
    workflowId: string,
    data: {
      nodes: any[]
      connections: any[]
      inputs?: Record<string, any>
    },
    tenantId?: string
  ): Promise<ExecutionResult>
  cancelExecution(
    executionId: string
  ): Promise<void>
  getExecutionDetails(
    executionId: string
  ): Promise<ExecutionResult | null>
  getExecutionStats(
    workflowId: string,
    tenantId?: string
  ): Promise<ExecutionStats>
  getExecutionHistory(
    workflowId: string,
    tenantId?: string,
    limit?: number
  ): Promise<ExecutionResult[]>
}
