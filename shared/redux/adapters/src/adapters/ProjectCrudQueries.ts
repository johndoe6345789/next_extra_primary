/**
 * Project CRUD fetch operations (list/get/create).
 * Mixed into DefaultProjectServiceAdapter.
 */

import type {
  Project,
  CreateProjectRequest,
} from '../types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

/** @brief List projects for a tenant */
export async function listProjects(
  this: { apiBaseUrl: string },
  tenantId: string,
  workspaceId?: string
): Promise<Project[]> {
  const params = new URLSearchParams({
    tenantId,
  })
  if (workspaceId) {
    params.append('workspaceId', workspaceId)
  }
  const r = await fetch(
    `${this.apiBaseUrl}/projects?${params}`
  )
  if (!r.ok) {
    throw new Error('Failed to fetch projects')
  }
  const d = await r.json()
  return d.projects || []
}

/** @brief Get single project by ID */
export async function getProject(
  this: { apiBaseUrl: string },
  id: string
): Promise<Project> {
  const r = await fetch(
    `${this.apiBaseUrl}/projects/${id}`
  )
  if (!r.ok) throw new Error('Project not found')
  return r.json()
}

/** @brief Create a new project */
export async function createProject(
  this: { apiBaseUrl: string },
  data: CreateProjectRequest
): Promise<Project> {
  const r = await fetch(
    `${this.apiBaseUrl}/projects`,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }
  )
  if (!r.ok) {
    throw new Error('Failed to create project')
  }
  return r.json()
}
