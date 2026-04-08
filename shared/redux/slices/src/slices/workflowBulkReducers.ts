/**
 * Bulk node/connection update reducers
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WorkflowNode, WorkflowConnection,
} from '../types/workflow';
import type { WorkflowState } from './workflowTypes';

/** Remove a connection */
export const removeConnectionReducer = (
  state: WorkflowState,
  action: PayloadAction<{
    source: string; target: string;
  }>
) => {
  state.connections = state.connections.filter(
    (c) => !(
      c.source === action.payload.source
      && c.target === action.payload.target
    )
  );
  state.isDirty = true;
};

/** Set nodes and connections in bulk */
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
