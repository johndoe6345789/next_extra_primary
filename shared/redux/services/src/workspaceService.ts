/**
 * Workspace Service - barrel re-export
 */

import {
  listWorkspaces, getWorkspace,
  createWorkspace, updateWorkspace,
  deleteWorkspace,
} from './workspaceCrud';

export const workspaceService = {
  listWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};

export default workspaceService;
