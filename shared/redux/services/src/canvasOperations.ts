/**
 * Canvas item API operations
 */

import { apiRequest } from './projectApiHelper';
import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
  BulkUpdateCanvasItemsRequest,
} from '../types/project';

/** Get all canvas items for project */
export async function getCanvasItems(
  projectId: string
): Promise<unknown> {
  return apiRequest(
    `/projects/${projectId}/canvas`
  );
}

/** Create canvas item */
export async function createCanvasItem(
  projectId: string,
  data: CreateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  return apiRequest<ProjectCanvasItem>(
    `/projects/${projectId}/canvas/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

/** Update canvas item */
export async function updateCanvasItem(
  projectId: string,
  itemId: string,
  data: UpdateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  return apiRequest<ProjectCanvasItem>(
    `/projects/${projectId}/canvas/items/` +
    `${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}

/** Delete canvas item */
export async function deleteCanvasItem(
  projectId: string,
  itemId: string
): Promise<void> {
  await apiRequest(
    `/projects/${projectId}/canvas/items/` +
    `${itemId}`, { method: 'DELETE' }
  );
}

/** Bulk update multiple canvas items */
export async function bulkUpdateCanvasItems(
  projectId: string,
  data: BulkUpdateCanvasItemsRequest
): Promise<unknown> {
  return apiRequest(
    `/projects/${projectId}/canvas/` +
    `bulk-update`, {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}
