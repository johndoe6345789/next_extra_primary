/**
 * Workspace CRUD operations
 */

import type { Workspace } from '../types/project';
import { apiRequest } from './projectApiHelper';

export {
  createWorkspace, updateWorkspace,
  deleteWorkspace,
} from './workspaceCrudWrite';

/** Log and rethrow an error */
function fail(msg: string, err: unknown): never {
  console.error(msg, err);
  throw err;
}

/** List all workspaces for tenant */
async function listWorkspaces(
  tenantId: string, limit = 50, offset = 0
): Promise<unknown> {
  try {
    return await apiRequest('/workspaces', {
      params: {
        tenantId,
        limit: String(limit),
        offset: String(offset),
      },
    });
  } catch (e) {
    fail('Failed to list workspaces:', e);
  }
}

/** Get specific workspace */
async function getWorkspace(
  id: string
): Promise<Workspace> {
  try {
    return await apiRequest<Workspace>(
      `/workspaces/${id}`
    );
  } catch (e) {
    fail(`Failed to get workspace ${id}:`, e);
  }
}

export { listWorkspaces, getWorkspace };
