/**
 * Workflow Redux Slice
 * Manages workflow metadata, nodes, connections
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import { workflowInitialState } from
  './workflowTypes';
import {
  loadWorkflowReducer, createWorkflowReducer,
  saveWorkflowReducer,
} from './workflowLifecycleReducers';
import {
  addNodeReducer, updateNodeReducer,
  deleteNodeReducer,
} from './workflowNodeReducers';
import {
  addConnectionReducer, removeConnectionReducer,
  updateConnectionsReducer,
  setNodesAndConnectionsReducer,
} from './workflowConnectionReducers';
import {
  startExecutionReducer, endExecutionReducer,
  clearExecutionHistoryReducer,
} from './workflowExecutionReducers';

export type { WorkflowState } from
  './workflowTypes';

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
    updateConnections: updateConnectionsReducer,
    setNodesAndConnections:
      setNodesAndConnectionsReducer,
    startExecution: startExecutionReducer,
    endExecution: endExecutionReducer,
    clearExecutionHistory:
      clearExecutionHistoryReducer,
    setSaving: (
      state, action: PayloadAction<boolean>
    ) => { state.isSaving = action.payload; },
    setSaveError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.saveError = action.payload;
      state.isSaving = false;
    },
    setDirty: (
      state, action: PayloadAction<boolean>
    ) => { state.isDirty = action.payload; },
    resetWorkflow: () => workflowInitialState,
  },
});

export const {
  loadWorkflow, createWorkflow, saveWorkflow,
  addNode, updateNode, deleteNode,
  addConnection, removeConnection,
  updateConnections, setNodesAndConnections,
  startExecution, endExecution,
  clearExecutionHistory,
  setSaving, setSaveError, setDirty,
  resetWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;
