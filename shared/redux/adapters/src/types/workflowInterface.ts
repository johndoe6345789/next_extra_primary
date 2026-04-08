/**
 * Workflow Service Adapter Interface
 * Contract for workflow implementations
 */

import type { Workflow } from '@shared/types'

/** @brief Workflow service contract */
export interface IWorkflowServiceAdapter {
  createWorkflow(data: {
    name: string
    description?: string
    tenantId: string
  }): Promise<Workflow>
  getWorkflow(
    workflowId: string,
    tenantId: string
  ): Promise<Workflow | undefined>
  listWorkflows(
    tenantId: string
  ): Promise<Workflow[]>
  saveWorkflow(
    workflow: Workflow
  ): Promise<void>
  deleteWorkflow(
    workflowId: string,
    tenantId: string
  ): Promise<void>
  validateWorkflow(
    workflowId: string,
    workflow: Workflow
  ): Promise<{
    valid: boolean
    errors: string[]
    warnings: string[]
  }>
  getWorkflowMetrics(
    workflow: Workflow
  ): Promise<{
    nodeCount: number
    connectionCount: number
    complexity:
      | 'simple'
      | 'moderate'
      | 'complex'
    depth: number
  }>
}
