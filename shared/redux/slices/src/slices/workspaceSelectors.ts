/**
 * Selectors for workspace state
 */

import type { Workspace } from '../types/project';

/** Workspace state shape */
interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Select all workspaces */
export const selectWorkspaces = (
  state: { workspace: WorkspaceState }
) => state.workspace.workspaces;

/** Select current workspace object */
export const selectCurrentWorkspace = (
  state: { workspace: WorkspaceState }
) => {
  if (!state.workspace.currentWorkspaceId) return null;
  return state.workspace.workspaces.find(
    (w) =>
      w.id === state.workspace.currentWorkspaceId
  );
};

/** Select current workspace ID */
export const selectCurrentWorkspaceId = (
  state: { workspace: WorkspaceState }
) => state.workspace.currentWorkspaceId;

/** Select workspace loading state */
export const selectWorkspaceIsLoading = (
  state: { workspace: WorkspaceState }
) => state.workspace.isLoading;

/** Select workspace error */
export const selectWorkspaceError = (
  state: { workspace: WorkspaceState }
) => state.workspace.error;
