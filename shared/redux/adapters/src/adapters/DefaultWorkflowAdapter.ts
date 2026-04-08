/**
 * DefaultWorkflowServiceAdapter
 * HTTP-based workflow CRUD operations.
 */

import type { IWorkflowServiceAdapter, Workflow } from '../types'
import { validateWorkflow, getWorkflowMetrics } from './DefaultWorkflowMetrics'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/** @brief HTTP adapter for workflow CRUD */
export class DefaultWorkflowServiceAdapter implements IWorkflowServiceAdapter {
  constructor(private apiBaseUrl: string = '/api') {}

  /** @brief Create a new workflow */
  async createWorkflow(data: { name: string; description?: string; tenantId: string }): Promise<Workflow> {
    const r = await fetch(`${this.apiBaseUrl}/workflows`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('Failed to create workflow')
    return r.json()
  }

  /** @brief Get workflow by ID and tenant */
  async getWorkflow(workflowId: string, tenantId: string): Promise<Workflow | undefined> {
    const r = await fetch(`${this.apiBaseUrl}/workflows/${workflowId}?tenantId=${tenantId}`)
    if (r.status === 404) return undefined
    if (!r.ok) throw new Error('Failed to fetch workflow')
    return r.json()
  }

  /** @brief List workflows for a tenant */
  async listWorkflows(tenantId: string): Promise<Workflow[]> {
    const r = await fetch(`${this.apiBaseUrl}/workflows?tenantId=${tenantId}`)
    if (!r.ok) throw new Error('Failed to fetch workflows')
    const d = await r.json()
    return d.workflows || []
  }

  /** @brief Save/update a workflow */
  async saveWorkflow(workflow: Workflow): Promise<void> {
    const r = await fetch(`${this.apiBaseUrl}/workflows/${workflow.id}`, {
      method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(workflow),
    })
    if (!r.ok) throw new Error('Failed to save workflow')
  }

  /** @brief Delete a workflow */
  async deleteWorkflow(workflowId: string, tenantId: string): Promise<void> {
    const r = await fetch(`${this.apiBaseUrl}/workflows/${workflowId}?tenantId=${tenantId}`, {
      method: 'DELETE',
    })
    if (!r.ok) throw new Error('Failed to delete workflow')
  }

  /** @brief Validate workflow via API */
  async validateWorkflow(workflowId: string, workflow: Workflow) {
    return validateWorkflow(this.apiBaseUrl, workflowId, workflow)
  }

  /** @brief Get workflow metrics */
  async getWorkflowMetrics(workflow: Workflow) {
    return getWorkflowMetrics(workflow)
  }
}
