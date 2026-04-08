/**
 * MockProjectServiceAdapter
 *
 * In-memory project and canvas item operations.
 */

import type {
  IProjectServiceAdapter,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectCanvasItem,
} from '../types'
import {
  createMockProject,
  updateMockProject,
} from './mockProjectOperations'
import {
  getCanvasItems,
  createCanvasItem,
  updateCanvasItem,
  deleteCanvasItem,
  bulkUpdateCanvasItems,
} from './MockProjectCanvasMixin'

/** @brief In-memory project CRUD */
export class MockProjectServiceAdapter
  implements IProjectServiceAdapter {
  private projects: Map<string, Project> =
    new Map()
  private canvasItems: Map<
    string,
    ProjectCanvasItem
  > = new Map()

  /** @brief List projects for tenant */
  async listProjects(
    tenantId: string,
    workspaceId?: string
  ): Promise<Project[]> {
    return Array.from(
      this.projects.values()
    ).filter(
      (p) =>
        p.tenantId === tenantId &&
        (!workspaceId ||
          p.workspaceId === workspaceId)
    )
  }

  /** @brief Get a project by ID */
  async getProject(
    id: string
  ): Promise<Project> {
    const project = this.projects.get(id)
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  }

  /** @brief Create a new project */
  async createProject(
    data: CreateProjectRequest
  ): Promise<Project> {
    return createMockProject(
      this.projects, data
    )
  }

  /** @brief Update a project */
  async updateProject(
    id: string,
    data: UpdateProjectRequest
  ): Promise<Project> {
    return updateMockProject(
      this.projects, id, data
    )
  }

  /** @brief Delete a project */
  async deleteProject(id: string): Promise<void> {
    if (!this.projects.has(id)) {
      throw new Error('Project not found')
    }
    this.projects.delete(id)
  }

  getCanvasItems = getCanvasItems
  createCanvasItem = createCanvasItem
  updateCanvasItem = updateCanvasItem
  deleteCanvasItem = deleteCanvasItem
  bulkUpdateCanvasItems = bulkUpdateCanvasItems
}
