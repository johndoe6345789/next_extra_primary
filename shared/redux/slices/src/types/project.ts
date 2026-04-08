/**
 * Re-export project types from shared types package
 */
export type {
  Workspace,
  Project,
  CanvasPosition,
  CanvasSize,
  ProjectCanvasItem,
  ProjectCanvasState,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest
} from '@shared/types';

// Collaboration types
export type {
  CollaborativeUser,
  CanvasUpdateEvent,
  CursorUpdateEvent,
  ActivityFeedEntry,
  ConflictItem
} from './projectCollaboration';

// API types
export type {
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
  BulkUpdateCanvasItemsRequest,
  WorkspaceListResponse,
  ProjectListResponse,
  CanvasItemListResponse,
  BulkUpdateCanvasItemsResponse
} from './projectApi';
