/**
 * Mock Project Operations
 *
 * Create and update logic for
 * MockProjectServiceAdapter.
 */

import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../types'

/**
 * @brief Create a mock project in the store
 * @param projects - In-memory project map
 * @param data - Creation request data
 * @returns The newly created project
 */
export function createMockProject(
  projects: Map<string, Project>,
  data: CreateProjectRequest
): Project {
  const id =
    `proj-${Date.now()}-` +
    `${Math.random().toString(36).substr(2, 9)}`
  const project: Project = {
    id,
    name: data.name,
    description: data.description,
    workspaceId: data.workspaceId,
    tenantId:
      data.tenantId || 'default-tenant',
    color: data.color,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  projects.set(project.id, project)
  return { ...project }
}

/**
 * @brief Update an existing mock project
 * @param projects - In-memory project map
 * @param id - Project ID to update
 * @param data - Fields to update
 * @returns The updated project
 */
export function updateMockProject(
  projects: Map<string, Project>,
  id: string,
  data: UpdateProjectRequest
): Project {
  const project = projects.get(id)
  if (!project) {
    throw new Error('Project not found')
  }
  const updated = {
    ...project,
    ...data,
    updatedAt: Date.now(),
  }
  projects.set(id, updated)
  return { ...updated }
}
