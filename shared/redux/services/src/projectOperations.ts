/**
 * Project CRUD operations
 */

import { apiRequest } from './projectApiHelper';
import type {
  Project, CreateProjectRequest,
  UpdateProjectRequest,
} from '../types/project';

/** List all projects */
export async function listProjects(
  tenantId: string,
  workspaceId?: string,
  limit = 50,
  offset = 0
): Promise<unknown> {
  const params: Record<string, string> = {
    tenantId,
    limit: String(limit),
    offset: String(offset),
  };
  if (workspaceId) {
    params.workspaceId = workspaceId;
  }
  return apiRequest('/projects', { params });
}

/** Get specific project */
export async function getProject(
  id: string
): Promise<Project> {
  return apiRequest<Project>(
    `/projects/${id}`
  );
}

/** Create new project */
export async function createProject(
  data: CreateProjectRequest
): Promise<Project> {
  return apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Update project */
export async function updateProject(
  id: string,
  data: UpdateProjectRequest
): Promise<Project> {
  return apiRequest<Project>(
    `/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

/** Delete project */
export async function deleteProject(
  id: string
): Promise<void> {
  await apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  });
}
