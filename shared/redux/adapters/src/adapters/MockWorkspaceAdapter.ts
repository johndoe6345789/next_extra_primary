/**
 * MockWorkspaceServiceAdapter
 *
 * In-memory workspace operations.
 */

import {
  IWorkspaceServiceAdapter,
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../types'

/** @brief In-memory workspace CRUD */
export class MockWorkspaceServiceAdapter
  implements IWorkspaceServiceAdapter {
  private workspaces: Map<string, Workspace> =
    new Map()

  /** @brief List workspaces for tenant */
  async listWorkspaces(
    tenantId: string
  ): Promise<Workspace[]> {
    return Array.from(
      this.workspaces.values()
    )
      .filter((w) => w.tenantId === tenantId)
      .map((w) => ({ ...w }))
  }

  /** @brief Get workspace by ID */
  async getWorkspace(
    id: string
  ): Promise<Workspace> {
    const ws = this.workspaces.get(id)
    if (!ws) {
      throw new Error('Workspace not found')
    }
    return { ...ws }
  }

  /** @brief Create workspace */
  async createWorkspace(
    data: CreateWorkspaceRequest
  ): Promise<Workspace> {
    const id = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const workspace: Workspace = {
      id,
      name: data.name,
      description: data.description,
      tenantId: data.tenantId || 'default-tenant',
      color: data.color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    this.workspaces.set(workspace.id, workspace)
    return { ...workspace }
  }

  /** @brief Update workspace */
  async updateWorkspace(
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> {
    const ws = await this.getWorkspace(id)
    const updated = {
      ...ws,
      ...data,
      updatedAt: Date.now(),
    }
    this.workspaces.set(id, updated)
    return { ...updated }
  }

  /** @brief Delete workspace */
  async deleteWorkspace(
    id: string
  ): Promise<void> {
    if (!this.workspaces.has(id)) {
      throw new Error('Workspace not found')
    }
    this.workspaces.delete(id)
  }
}
