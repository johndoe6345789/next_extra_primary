/**
 * Project mutation fetch operations
 * (update/delete). Mixed into
 * DefaultProjectServiceAdapter.
 */

import type {
  Project,
  UpdateProjectRequest,
} from '../types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

/** @brief Update an existing project */
export async function updateProject(
  this: { apiBaseUrl: string },
  id: string,
  data: UpdateProjectRequest
): Promise<Project> {
  const r = await fetch(
    `${this.apiBaseUrl}/projects/${id}`,
    {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    }
  )
  if (!r.ok) {
    throw new Error('Failed to update project')
  }
  return r.json()
}

/** @brief Delete a project by ID */
export async function deleteProject(
  this: { apiBaseUrl: string },
  id: string
): Promise<void> {
  const r = await fetch(
    `${this.apiBaseUrl}/projects/${id}`,
    { method: 'DELETE' }
  )
  if (!r.ok) {
    throw new Error('Failed to delete project')
  }
}
