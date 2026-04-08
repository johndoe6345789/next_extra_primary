/**
 * API request types for project system
 * Used by services and API clients
 */

import type {
  CanvasPosition, CanvasSize,
} from './projectBase';

export type {
  WorkspaceListResponse,
  ProjectListResponse,
  CanvasItemListResponse,
  BulkUpdateCanvasItemsResponse,
} from './projectResponses';

/** Create workspace request */
export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  tenantId?: string;
}

/** Update workspace request */
export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

/** Create project request */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspaceId: string;
  color?: string;
  tenantId?: string;
}

/** Update project request */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  starred?: boolean;
}

/** Create canvas item request */
export interface CreateCanvasItemRequest {
  workflowId: string;
  position?: CanvasPosition;
  size?: CanvasSize;
  color?: string;
}

/** Update canvas item request */
export interface UpdateCanvasItemRequest {
  position?: CanvasPosition;
  size?: CanvasSize;
  zIndex?: number;
  color?: string;
  minimized?: boolean;
}

/** Bulk update canvas items request */
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
