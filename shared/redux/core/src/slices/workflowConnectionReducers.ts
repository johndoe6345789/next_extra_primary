/**
 * Workflow connection management reducers
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WorkflowNode, WorkflowConnection,
} from '../types/workflow';
import type { WorkflowState } from './workflowTypes';

/** Add a connection between nodes */
export const addConnectionReducer = (
  state: WorkflowState,
  action: PayloadAction<WorkflowConnection>
) => {
  const exists = state.connections.some(
    (c) =>
      c.source === action.payload.source &&
      c.target === action.payload.target
  );
  if (!exists) {
    state.connections.push(action.payload);
    state.isDirty = true;
  }
};

/** Remove a connection */
export const removeConnectionReducer = (
  state: WorkflowState,
  action: PayloadAction<{
    source: string;
    target: string;
  }>
) => {
  state.connections = state.connections.filter(
    (c) =>
      !(
        c.source === action.payload.source &&
        c.target === action.payload.target
      )
  );
  state.isDirty = true;
};

/** Replace all connections */
export const updateConnectionsReducer = (
  state: WorkflowState,
  action: PayloadAction<WorkflowConnection[]>
) => {
  state.connections = action.payload;
  state.isDirty = true;
};

/** Set both nodes and connections at once */
export const setNodesAndConnectionsReducer = (
  state: WorkflowState,
  action: PayloadAction<{
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  }>
) => {
  state.nodes = action.payload.nodes;
  state.connections = action.payload.connections;
  state.isDirty = true;
};
