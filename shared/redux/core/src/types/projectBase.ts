/**
 * Core project entity type definitions
 * Workspaces, projects, canvas items, and canvas state
 */

/**
 * Workspace - Top-level container for organizing projects
 */
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

/**
 * Project - Container within a workspace
 */
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

/**
 * ProjectCanvasItem - Workflow card on the canvas
 */
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

/**
 * Canvas state for zoom, pan, and selection
 */
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

/** Canvas position data */
export interface CanvasPosition {
  x: number;
  y: number;
}

/** Canvas size data */
export interface CanvasSize {
  width: number;
  height: number;
}
