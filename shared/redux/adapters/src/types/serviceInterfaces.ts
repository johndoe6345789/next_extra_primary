/**
 * Service Adapter Interfaces
 *
 * Contracts for project and workspace adapters.
 */

import type {
  Project, Workspace,
  ProjectCanvasItem,
  CreateProjectRequest, UpdateProjectRequest,
  CreateWorkspaceRequest, UpdateWorkspaceRequest,
} from '@shared/types'
import type {
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from './adapterTypes'

/** @brief Project service contract */
export interface IProjectServiceAdapter {
  listProjects(
    tenantId: string, workspaceId?: string
  ): Promise<Project[]>
  getProject(id: string): Promise<Project>
  createProject(
    data: CreateProjectRequest
  ): Promise<Project>
  updateProject(
    id: string, data: UpdateProjectRequest
  ): Promise<Project>
  deleteProject(id: string): Promise<void>
  getCanvasItems(
    projectId: string
  ): Promise<ProjectCanvasItem[]>
  createCanvasItem(
    projectId: string,
    data: CreateCanvasItemRequest
  ): Promise<ProjectCanvasItem>
  updateCanvasItem(
    projectId: string, itemId: string,
    data: UpdateCanvasItemRequest
  ): Promise<ProjectCanvasItem>
  deleteCanvasItem(
    projectId: string, itemId: string
  ): Promise<void>
  bulkUpdateCanvasItems(
    projectId: string,
    updates: Array<
      Partial<ProjectCanvasItem> & { id: string }
    >
  ): Promise<ProjectCanvasItem[]>
}

/** @brief Workspace service contract */
export interface IWorkspaceServiceAdapter {
  listWorkspaces(
    tenantId: string
  ): Promise<Workspace[]>
  getWorkspace(id: string): Promise<Workspace>
  createWorkspace(
    data: CreateWorkspaceRequest
  ): Promise<Workspace>
  updateWorkspace(
    id: string, data: UpdateWorkspaceRequest
  ): Promise<Workspace>
  deleteWorkspace(id: string): Promise<void>
}
