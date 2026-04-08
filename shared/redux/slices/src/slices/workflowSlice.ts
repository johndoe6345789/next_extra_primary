/**
 * Workflow Redux Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ExecutionResult } from '../types/workflow';
import { workflowInitialState } from './workflowTypes';
import {
  loadWorkflowReducer, createWorkflowReducer,
  saveWorkflowReducer
} from './workflowLifecycleReducers';
import {
  addNodeReducer, updateNodeReducer,
  deleteNodeReducer, addConnectionReducer,
  removeConnectionReducer,
  setNodesAndConnectionsReducer
} from './workflowNodeReducers';

export type { WorkflowState } from './workflowTypes';

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState: workflowInitialState,
  reducers: {
    loadWorkflow: loadWorkflowReducer,
    createWorkflow: createWorkflowReducer,
    saveWorkflow: saveWorkflowReducer,
    addNode: addNodeReducer,
    updateNode: updateNodeReducer,
    deleteNode: deleteNodeReducer,
    addConnection: addConnectionReducer,
    removeConnection: removeConnectionReducer,
    setNodesAndConnections:
      setNodesAndConnectionsReducer,
    startExecution: (
      state, action: PayloadAction<ExecutionResult>
    ) => { state.currentExecution = action.payload; },
    endExecution: (
      state, action: PayloadAction<ExecutionResult>
    ) => {
      state.currentExecution = null;
      state.executionHistory.unshift(action.payload);
      if (state.executionHistory.length > 50) {
        state.executionHistory.pop();
      }
    },
    clearExecutionHistory: (state) => {
      state.executionHistory = [];
      state.currentExecution = null;
    },
    setSaving: (
      state, action: PayloadAction<boolean>
    ) => { state.isSaving = action.payload; },
    setDirty: (
      state, action: PayloadAction<boolean>
    ) => { state.isDirty = action.payload; },
    resetWorkflow: () => workflowInitialState
  }
});

export const {
  loadWorkflow, createWorkflow, saveWorkflow,
  addNode, updateNode, deleteNode,
  addConnection, removeConnection,
  setNodesAndConnections,
  startExecution, endExecution,
  clearExecutionHistory,
  setSaving, setDirty, resetWorkflow
} = workflowSlice.actions;

export {
  selectCurrentWorkflow, selectWorkflowNodes,
  selectWorkflowConnections, selectWorkflowIsDirty,
  selectWorkflowIsSaving, selectCurrentExecution,
  selectExecutionHistory, selectLastSaved,
  selectSaveError
} from './workflowSelectors';

export default workflowSlice.reducer;
