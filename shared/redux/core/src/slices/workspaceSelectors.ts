/**
 * Selectors for the workspace slice
 */

import type { WorkspaceState } from
  './workspaceSlice';

/** Select all workspaces */
export const selectWorkspaces = (
  state: { workspace: WorkspaceState }
) => state.workspace.workspaces;

/** Select the current workspace */
export const selectCurrentWorkspace = (
  state: { workspace: WorkspaceState }
) => {
  if (!state.workspace.currentWorkspaceId) {
    return null;
  }
  return state.workspace.workspaces.find(
    (w) =>
      w.id === state.workspace.currentWorkspaceId
  );
};

/** Select current workspace ID */
export const selectCurrentWorkspaceId = (
  state: { workspace: WorkspaceState }
) => state.workspace.currentWorkspaceId;

/** Select loading state */
export const selectWorkspaceIsLoading = (
  state: { workspace: WorkspaceState }
) => state.workspace.isLoading;

/** Select error state */
export const selectWorkspaceError = (
  state: { workspace: WorkspaceState }
) => state.workspace.error;
