/**
 * Node registry reducers for core nodesSlice
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type { NodeType } from '../types/workflow';
import type { NodesState } from './nodesSlice';

/** Set registry and rebuild categories */
export const setRegistryReducer = (
  state: NodesState,
  action: PayloadAction<NodeType[]>
) => {
  state.registry = action.payload;
  state.categories = Array.from(
    new Set(
      action.payload.map((n) => n.category)
    )
  );
  state.error = null;
};

/** Add a node type if not duplicate */
export const addNodeTypeReducer = (
  state: NodesState,
  action: PayloadAction<NodeType>
) => {
  const exists = state.registry.some(
    (n) => n.id === action.payload.id
  );
  if (!exists) {
    state.registry.push(action.payload);
    if (!state.categories.includes(
      action.payload.category
    )) {
      state.categories.push(
        action.payload.category
      );
    }
  }
};

/** Remove a node type by ID */
export const removeNodeTypeReducer = (
  state: NodesState,
  action: PayloadAction<string>
) => {
  state.registry = state.registry.filter(
    (n) => n.id !== action.payload
  );
};
