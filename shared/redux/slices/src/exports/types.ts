/**
 * Type exports for @shared/redux-slices
 */

export type {
  CanvasPosition,
  CanvasSize,
  Workspace,
  Project,
  ProjectCanvasItem,
  ProjectCanvasState,
  CollaborativeUser,
  CanvasUpdateEvent
} from '../types/project';

export type {
  Workflow,
  WorkflowNode,
  WorkflowConnection,
  NodeExecutionResult,
  ExecutionResult
} from '../types/workflow';

// Store Types - Types used by hooks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = any;

/** RootState includes all slice state types */
export interface RootState {
  workflow: import('../slices/workflowSlice').WorkflowState;
  workflows: import('../slices/workflowsSlice').WorkflowsState;
  canvas: unknown;
  canvasItems: unknown;
  editor: unknown;
  connection: unknown;
  ui: unknown;
  auth: unknown;
  project: unknown;
  workspace: unknown;
  nodes: unknown;
  collaboration: unknown;
  realtime: unknown;
  documentation: unknown;
  asyncData: unknown;
  [key: string]: unknown;
}
