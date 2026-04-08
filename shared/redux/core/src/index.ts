/**
 * Redux core package barrel exports
 */

export {
  authSlice, setLoading, setError,
  setAuthenticated, setUser, logout, clearError,
  restoreFromStorage,
  selectIsAuthenticated, selectUser,
  selectToken, selectIsLoading, selectError,
  type AuthState, type User,
  projectSlice,
  setProjectLoading, setProjectError,
  setProjects, addProject, updateProject,
  removeProject, setCurrentProject, clearProject,
  selectProjects, selectCurrentProject,
  selectCurrentProjectId,
  selectProjectIsLoading, selectProjectError,
  type ProjectState,
  workspaceSlice,
  setWorkspaceLoading, setWorkspaceError,
  setWorkspaces, addWorkspace, updateWorkspace,
  removeWorkspace, setCurrentWorkspace,
  clearWorkspaces,
  selectWorkspaces, selectCurrentWorkspace,
  selectCurrentWorkspaceId,
  selectWorkspaceIsLoading, selectWorkspaceError,
  type WorkspaceState,
} from './exports/sliceExports';

export {
  workflowSlice, loadWorkflow, createWorkflow,
  saveWorkflow, addNode, updateNode, deleteNode,
  addConnection, removeConnection,
  updateConnections, setNodesAndConnections,
  startExecution, endExecution,
  clearExecutionHistory,
  setSaving, setSaveError, setDirty,
  resetWorkflow, type WorkflowState,
  nodesSlice, setRegistry, addNodeType,
  removeNodeType, setTemplates, addTemplate,
  removeTemplate, updateTemplate, setCategories,
  setNodesLoading, setNodesError,
  resetNodes, type NodesState,
  asyncDataSlice, setRequestLoading,
  setRequestError, setRequestData,
  clearRequest, clearAllRequests, resetRequest,
  setGlobalLoading, setGlobalError,
  setRefetchInterval,
  fetchAsyncData, mutateAsyncData,
  refetchAsyncData, cleanupAsyncRequests,
  selectAsyncRequest, selectAsyncData,
  selectAsyncError, selectAsyncLoading,
  selectAsyncRefetching, selectAllAsyncRequests,
  selectGlobalLoading, selectGlobalError,
  type AsyncDataState,
} from './exports/dataExports';

// Types
export type * from './types';

// Middleware and DevTools
export {
  getMiddlewareConfig, getDevToolsConfig,
  devToolsConfig,
  createLoggingMiddleware,
  createPerformanceMiddleware,
  createErrorMiddleware,
  createAnalyticsMiddleware,
  enableReduxDevTools,
} from './middleware';

// Store types and typed hooks
export type {
  RootState, AppDispatch,
} from './store';
export {
  useAppDispatch, useAppSelector,
} from './store';

// Reducer map for configureStore
export { coreReducers } from './reducerMap';
