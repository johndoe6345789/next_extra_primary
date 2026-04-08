/**
 * Type definitions for useDashboardLogic
 */

/** Return type of useDashboardLogic */
export interface UseDashboardLogicReturn {
  isLoading: boolean;
  showCreateForm: boolean;
  newWorkspaceName: string;
  workspaces: unknown[];
  currentWorkspace: unknown;
  setShowCreateForm: (show: boolean) => void;
  setNewWorkspaceName: (
    name: string
  ) => void;
  handleCreateWorkspace: (
    e: React.FormEvent
  ) => Promise<void>;
  handleWorkspaceClick: (
    workspaceId: string
  ) => void;
  resetWorkspaceForm: () => void;
}
