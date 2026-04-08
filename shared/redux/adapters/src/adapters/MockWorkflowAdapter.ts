/**
 * MockWorkflowServiceAdapter
 * In-memory workflow operations.
 */

import { IWorkflowServiceAdapter, Workflow } from '../types'

/** @brief In-memory workflow CRUD */
export class MockWorkflowServiceAdapter implements IWorkflowServiceAdapter {
  private workflows: Map<string, Workflow> = new Map()

  /** @brief Create workflow */
  async createWorkflow(data: { name: string; description?: string; tenantId: string }): Promise<Workflow> {
    const id = `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const wf: Workflow = {
      id, ...data, version: '1.0.0', nodes: [], connections: [],
      createdAt: Date.now(), updatedAt: Date.now(),
    }
    this.workflows.set(wf.id, wf)
    return { ...wf }
  }

  /** @brief Get workflow by ID */
  async getWorkflow(workflowId: string, tenantId: string): Promise<Workflow | undefined> {
    const wf = this.workflows.get(workflowId)
    if (!wf || wf.tenantId !== tenantId) return undefined
    return { ...wf }
  }

  /** @brief List all workflows for tenant */
  async listWorkflows(tenantId: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values())
      .filter((w) => w.tenantId === tenantId).map((w) => ({ ...w }))
  }

  /** @brief Save/update workflow */
  async saveWorkflow(workflow: Workflow): Promise<void> {
    if (!this.workflows.has(workflow.id)) throw new Error('Workflow not found')
    this.workflows.set(workflow.id, { ...workflow, updatedAt: Date.now() })
  }

  /** @brief Delete workflow */
  async deleteWorkflow(workflowId: string, tenantId: string): Promise<void> {
    const wf = this.workflows.get(workflowId)
    if (!wf || wf.tenantId !== tenantId) throw new Error('Workflow not found')
    this.workflows.delete(workflowId)
  }

  /** @brief Validate workflow */
  async validateWorkflow(workflowId: string, workflow: Workflow) {
    const errors: string[] = []
    if (workflow.nodes.length === 0) errors.push('Workflow must have at least one node')
    if (!workflow.name) errors.push('Workflow must have a name')
    return { valid: errors.length === 0, errors, warnings: [] }
  }

  /** @brief Compute metrics */
  async getWorkflowMetrics(workflow: Workflow) {
    const n = workflow.nodes.length
    const complexity: 'simple' | 'moderate' | 'complex' = n > 20 ? 'complex' : n > 5 ? 'moderate' : 'simple'
    return { nodeCount: n, connectionCount: workflow.connections.length, complexity, depth: 1 }
  }
}
