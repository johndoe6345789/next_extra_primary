/**
 * Project System Type Definitions
 * Re-exports from sub-modules.
 */

export type {
  Workspace,
  Project,
  ProjectCanvasItem,
  ProjectCanvasState,
  CanvasPosition,
  CanvasSize,
} from './projectEntities'

export type {
  CollaborativeUser,
  CanvasUpdateEvent,
  CursorUpdateEvent,
  ActivityFeedEntry,
  ConflictItem,
} from './projectCollaboration'

export type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
  BulkUpdateCanvasItemsRequest,
} from './projectApiTypes'

export type {
  WorkspaceListResponse,
  ProjectListResponse,
  CanvasItemListResponse,
  BulkUpdateCanvasItemsResponse,
} from './projectResponses'
