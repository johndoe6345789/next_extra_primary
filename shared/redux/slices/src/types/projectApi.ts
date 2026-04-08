/**
 * API request/response types for project operations
 */

import type {
  CanvasPosition,
  CanvasSize,
  ProjectCanvasItem
} from '@shared/types';

/** Request to create a canvas item */
export interface CreateCanvasItemRequest {
  workflowId: string;
  position?: CanvasPosition;
  size?: CanvasSize;
  color?: string;
}

/** Request to update a canvas item */
export interface UpdateCanvasItemRequest {
  position?: CanvasPosition;
  size?: CanvasSize;
  zIndex?: number;
  color?: string;
  minimized?: boolean;
}

/** Request to update multiple canvas items */
export interface BulkUpdateCanvasItemsRequest {
  items: Array<{
    id: string;
    position?: CanvasPosition;
    size?: CanvasSize;
    zIndex?: number;
    color?: string;
    minimized?: boolean;
  }>;
}

/** Workspace list API response */
export interface WorkspaceListResponse {
  workspaces: import('@shared/types').Workspace[];
  count: number;
  total: number;
}

/** Project list API response */
export interface ProjectListResponse {
  projects: import('@shared/types').Project[];
  count: number;
  total: number;
}

/** Canvas item list API response */
export interface CanvasItemListResponse {
  items: ProjectCanvasItem[];
  count: number;
}

/** Bulk update canvas items API response */
export interface BulkUpdateCanvasItemsResponse {
  items: ProjectCanvasItem[];
  count: number;
}
