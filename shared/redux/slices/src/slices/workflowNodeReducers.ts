/**
 * Workflow node reducer logic
 * Used by workflowSlice via imported functions
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type {
  WorkflowNode, WorkflowConnection,
} from '../types/workflow';
import type { WorkflowState } from
  './workflowTypes';

export {
  removeConnectionReducer,
  setNodesAndConnectionsReducer,
} from './workflowBulkReducers';

/** Add a node to the workflow */
export const addNodeReducer = (
  state: WorkflowState,
  action: PayloadAction<WorkflowNode>
) => {
  state.nodes.push(action.payload);
  state.isDirty = true;
};

/** Update an existing node */
export const updateNodeReducer = (
  state: WorkflowState,
  action: PayloadAction<{
    id: string; data: Partial<WorkflowNode>;
  }>
) => {
  const i = state.nodes.findIndex(
    (n) => n.id === action.payload.id
  );
  if (i !== -1) {
    state.nodes[i] = {
      ...state.nodes[i],
      ...action.payload.data,
    };
    state.isDirty = true;
  }
};

/** Delete a node and its connections */
export const deleteNodeReducer = (
  state: WorkflowState,
  action: PayloadAction<string>
) => {
  state.nodes = state.nodes.filter(
    (n) => n.id !== action.payload
  );
  state.connections = state.connections.filter(
    (c) => c.source !== action.payload
      && c.target !== action.payload
  );
  state.isDirty = true;
};

/** Add a connection if not duplicate */
export const addConnectionReducer = (
  state: WorkflowState,
  action: PayloadAction<WorkflowConnection>
) => {
  const exists = state.connections.some(
    (c) => c.source === action.payload.source
      && c.target === action.payload.target
  );
  if (!exists) {
    state.connections.push(action.payload);
    state.isDirty = true;
  }
};
