/**
 * Workflow and workspace data exports
 */

export {
  workflowSlice, type WorkflowState
} from '../slices/workflowSlice';
export {
  loadWorkflow, createWorkflow, saveWorkflow,
  addNode, updateNode, deleteNode,
  addConnection, removeConnection,
  setNodesAndConnections,
  startExecution, endExecution,
  clearExecutionHistory,
  setSaving, setDirty, resetWorkflow,
  selectCurrentWorkflow, selectWorkflowNodes,
  selectWorkflowConnections,
  selectWorkflowIsDirty, selectWorkflowIsSaving,
  selectCurrentExecution, selectExecutionHistory,
  selectLastSaved, selectSaveError
} from '../slices/workflowSlice';

export {
  workflowsSlice, type WorkflowsState
} from '../slices/workflowsSlice';
export {
  setWorkflows, addWorkflowToList,
  updateWorkflowInList, removeWorkflowFromList,
  clearWorkflows,
  setLoading as setWorkflowsLoading,
  setError as setWorkflowsError,
  selectWorkflows, selectWorkflowsIsLoading,
  selectWorkflowsError
} from '../slices/workflowsSlice';

export {
  workspaceSlice
} from '../slices/workspaceSlice';
export {
  setWorkspaces, addWorkspace, updateWorkspace,
  removeWorkspace, setCurrentWorkspace,
  clearWorkspaces,
  setLoading as setWorkspaceLoading,
  setError as setWorkspaceError,
  selectWorkspaces, selectCurrentWorkspace,
  selectCurrentWorkspaceId,
  selectWorkspaceIsLoading, selectWorkspaceError
} from '../slices/workspaceSlice';

export { projectSlice } from '../slices/projectSlice';
export {
  setProjects, addProject, updateProject,
  removeProject, setCurrentProject, clearProject,
  setLoading as setProjectLoading,
  setError as setProjectError,
  selectProjects, selectCurrentProject,
  selectCurrentProjectId, selectProjectIsLoading,
  selectProjectError
} from '../slices/projectSlice';
