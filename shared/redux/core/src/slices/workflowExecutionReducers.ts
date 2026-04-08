/**
 * Workflow execution reducer logic
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type { ExecutionResult } from
  '../types/workflow';
import type { WorkflowState } from
  './workflowTypes';

/** Start a workflow execution */
export const startExecutionReducer = (
  state: WorkflowState,
  action: PayloadAction<ExecutionResult>
) => {
  state.currentExecution = action.payload;
};

/** End execution and add to history */
export const endExecutionReducer = (
  state: WorkflowState,
  action: PayloadAction<ExecutionResult>
) => {
  state.currentExecution = null;
  state.executionHistory.unshift(action.payload);
  if (state.executionHistory.length > 50) {
    state.executionHistory.pop();
  }
};

/** Clear all execution history */
export const clearExecutionHistoryReducer = (
  state: WorkflowState
) => {
  state.executionHistory = [];
  state.currentExecution = null;
};
