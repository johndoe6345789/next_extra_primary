/**
 * Workspace write operations (create, update, del)
 */

import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../types/project';
import { apiRequest } from './projectApiHelper';

/** Log and rethrow an error */
function fail(msg: string, err: unknown): never {
  console.error(msg, err);
  throw err;
}

/** Create new workspace */
export async function createWorkspace(
  data: CreateWorkspaceRequest
): Promise<Workspace> {
  try {
    return await apiRequest<Workspace>(
      '/workspaces', {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  } catch (e) {
    fail('Failed to create workspace:', e);
  }
}

/** Update workspace */
export async function updateWorkspace(
  id: string, data: UpdateWorkspaceRequest
): Promise<Workspace> {
  try {
    return await apiRequest<Workspace>(
      `/workspaces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  } catch (e) {
    fail(`Failed to update workspace ${id}:`, e);
  }
}

/** Delete workspace */
export async function deleteWorkspace(
  id: string
): Promise<void> {
  try {
    await apiRequest(`/workspaces/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    fail(`Failed to delete workspace ${id}:`, e);
  }
}
