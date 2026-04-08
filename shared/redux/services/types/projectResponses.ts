/**
 * Project API Response Types
 * Response types from the project API
 */

import type {
  Workspace,
  Project,
  ProjectCanvasItem,
} from './projectEntities'

/** @brief Workspace list response */
export interface WorkspaceListResponse {
  workspaces: Workspace[];
  count: number;
  total: number;
}

/** @brief Project list response */
export interface ProjectListResponse {
  projects: Project[];
  count: number;
  total: number;
}

/** @brief Canvas items list response */
export interface CanvasItemListResponse {
  items: ProjectCanvasItem[];
  count: number;
}

/** @brief Bulk update response */
export interface BulkUpdateCanvasItemsResponse {
  items: ProjectCanvasItem[];
  count: number;
}
