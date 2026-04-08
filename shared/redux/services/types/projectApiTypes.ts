/**
 * Project API Request Types
 * HTTP request types for the project system.
 */

import type {
  CanvasPosition,
  CanvasSize,
} from './projectEntities'

/** @brief Create workspace request */
export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  tenantId?: string;
}

/** @brief Update workspace request */
export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

/** @brief Create project request */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspaceId: string;
  color?: string;
  tenantId?: string;
}

/** @brief Update project request */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  starred?: boolean;
}

/** @brief Create canvas item request */
export interface CreateCanvasItemRequest {
  workflowId: string;
  position?: CanvasPosition;
  size?: CanvasSize;
  color?: string;
}

/** @brief Update canvas item request */
export interface UpdateCanvasItemRequest {
  position?: CanvasPosition;
  size?: CanvasSize;
  zIndex?: number;
  color?: string;
  minimized?: boolean;
}

/** @brief Bulk update canvas items request */
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
