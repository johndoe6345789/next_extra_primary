/**
 * Project Entity Type Definitions
 * Core types for workspaces, projects,
 * and canvas items.
 */

/** @brief Workspace - top-level container */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  tenantId: string;
  createdAt: number;
  updatedAt: number;
}

/** @brief Project - container in workspace */
export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  tenantId: string;
  color?: string;
  starred?: boolean;
  createdAt: number;
  updatedAt: number;
}

/** @brief Workflow card on canvas */
export interface ProjectCanvasItem {
  id: string;
  projectId: string;
  workflowId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  color?: string;
  minimized?: boolean;
  createdAt: number;
  updatedAt: number;
}

/** @brief Canvas zoom/pan/selection state */
export interface ProjectCanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedItemIds: Set<string>;
  isDragging: boolean;
  isResizing: boolean;
  gridSnap: boolean;
  showGrid: boolean;
  snapSize: number;
}

/** @brief Canvas position coordinates */
export interface CanvasPosition {
  x: number;
  y: number;
}

/** @brief Canvas size dimensions */
export interface CanvasSize {
  width: number;
  height: number;
}
