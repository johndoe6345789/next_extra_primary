/**
 * Slice re-exports for core package
 */

export {
  authSlice, setLoading, setError,
  setAuthenticated, setUser, logout, clearError,
  restoreFromStorage,
  selectIsAuthenticated, selectUser,
  selectToken, selectIsLoading, selectError,
  type AuthState, type User,
} from '../slices/authSlice';

export {
  projectSlice,
  setLoading as setProjectLoading,
  setError as setProjectError,
  setProjects, addProject, updateProject,
  removeProject, setCurrentProject, clearProject,
  selectProjects, selectCurrentProject,
  selectCurrentProjectId,
  selectProjectIsLoading, selectProjectError,
  type ProjectState,
} from '../slices/projectSlice';

export {
  workspaceSlice,
  setLoading as setWorkspaceLoading,
  setError as setWorkspaceError,
  setWorkspaces, addWorkspace, updateWorkspace,
  removeWorkspace, setCurrentWorkspace,
  clearWorkspaces,
  selectWorkspaces, selectCurrentWorkspace,
  selectCurrentWorkspaceId,
  selectWorkspaceIsLoading, selectWorkspaceError,
  type WorkspaceState,
} from '../slices/workspaceSlice';
