/**
 * DefaultWorkspaceServiceAdapter
 * HTTP-based workspace operations.
 */

import type {
  IWorkspaceServiceAdapter, Workspace,
  CreateWorkspaceRequest, UpdateWorkspaceRequest,
} from '../types'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/** @brief HTTP adapter for workspace CRUD */
export class DefaultWorkspaceServiceAdapter
  implements IWorkspaceServiceAdapter {
  constructor(private apiBaseUrl: string = '/api') {}

  /** @brief List workspaces for a tenant */
  async listWorkspaces(tenantId: string): Promise<Workspace[]> {
    const r = await fetch(`${this.apiBaseUrl}/workspaces?tenantId=${tenantId}`)
    if (!r.ok) throw new Error('Failed to fetch workspaces')
    const d = await r.json()
    return d.workspaces || []
  }

  /** @brief Get workspace by ID */
  async getWorkspace(id: string): Promise<Workspace> {
    const r = await fetch(`${this.apiBaseUrl}/workspaces/${id}`)
    if (!r.ok) throw new Error('Workspace not found')
    return r.json()
  }

  /** @brief Create a new workspace */
  async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    const r = await fetch(`${this.apiBaseUrl}/workspaces`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('Failed to create workspace')
    return r.json()
  }

  /** @brief Update an existing workspace */
  async updateWorkspace(id: string, data: UpdateWorkspaceRequest): Promise<Workspace> {
    const r = await fetch(`${this.apiBaseUrl}/workspaces/${id}`, {
      method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('Failed to update workspace')
    return r.json()
  }

  /** @brief Delete workspace by ID */
  async deleteWorkspace(id: string): Promise<void> {
    const r = await fetch(`${this.apiBaseUrl}/workspaces/${id}`, { method: 'DELETE' })
    if (!r.ok) throw new Error('Failed to delete workspace')
  }
}
