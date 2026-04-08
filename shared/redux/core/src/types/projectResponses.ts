/**
 * API response types for project system
 */

import type {
  Workspace, Project, ProjectCanvasItem,
} from './projectBase';

/** Workspace list response */
export interface WorkspaceListResponse {
  workspaces: Workspace[];
  count: number;
  total: number;
}

/** Project list response */
export interface ProjectListResponse {
  projects: Project[];
  count: number;
  total: number;
}

/** Canvas item list response */
export interface CanvasItemListResponse {
  items: ProjectCanvasItem[];
  count: number;
}

/** Bulk update canvas items response */
export interface BulkUpdateCanvasItemsResponse {
  items: ProjectCanvasItem[];
  count: number;
}
