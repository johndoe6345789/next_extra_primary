/**
 * Selectors for workflow state
 */

import type { WorkflowState } from './workflowTypes';

/** Select current workflow */
export const selectCurrentWorkflow = (
  state: { workflow: WorkflowState }
) => state.workflow.current;

/** Select workflow nodes */
export const selectWorkflowNodes = (
  state: { workflow: WorkflowState }
) => state.workflow.nodes;

/** Select workflow connections */
export const selectWorkflowConnections = (
  state: { workflow: WorkflowState }
) => state.workflow.connections;

/** Select whether workflow has unsaved changes */
export const selectWorkflowIsDirty = (
  state: { workflow: WorkflowState }
) => state.workflow.isDirty;

/** Select whether workflow is being saved */
export const selectWorkflowIsSaving = (
  state: { workflow: WorkflowState }
) => state.workflow.isSaving;

/** Select current execution result */
export const selectCurrentExecution = (
  state: { workflow: WorkflowState }
) => state.workflow.currentExecution;

/** Select execution history */
export const selectExecutionHistory = (
  state: { workflow: WorkflowState }
) => state.workflow.executionHistory;

/** Select last saved timestamp */
export const selectLastSaved = (
  state: { workflow: WorkflowState }
) => state.workflow.lastSaved;

/** Select save error message */
export const selectSaveError = (
  state: { workflow: WorkflowState }
) => state.workflow.saveError;
