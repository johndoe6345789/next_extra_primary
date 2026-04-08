/**
 * Workspace slice type definitions
 */

import type { Workspace } from '../types/project';

/** Workspace slice state shape */
export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Initial workspace state */
export const workspaceInitialState: WorkspaceState =
{
  workspaces: [],
  currentWorkspaceId: null,
  isLoading: false,
  error: null,
};
