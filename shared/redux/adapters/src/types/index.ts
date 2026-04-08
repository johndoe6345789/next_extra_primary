/**
 * Service Adapter Types
 *
 * Re-exports canonical types and
 * adapter-specific interfaces.
 */

// Canonical types from @shared/types
export type {
  Workflow,
  WorkflowNode,
  WorkflowConnection,
  ExecutionResult,
  ExecutionStats,
  ExecutionStatus,
  NodeExecutionResult,
  Project,
  Workspace,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  ProjectCanvasItem,
  CanvasPosition,
  CanvasSize,
  ProjectCanvasState,
} from '@shared/types'

// Adapter-specific types
export type {
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
  User,
  AuthResponse,
} from './adapterTypes'

// Service interfaces
export type {
  IProjectServiceAdapter,
  IWorkspaceServiceAdapter,
} from './serviceInterfaces'

// Workflow interface
export type {
  IWorkflowServiceAdapter,
} from './workflowInterface'

// Execution interface
export type {
  IExecutionServiceAdapter,
} from './executionInterface'

// Auth interface
export type {
  IAuthServiceAdapter,
} from './authInterface'

// Service container
export type {
  IServiceProviders,
} from './serviceContainer'
