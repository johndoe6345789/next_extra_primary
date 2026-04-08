/**
 * Editor selection reducer logic
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type { EditorState } from './editorTypes';

/** Select a single node */
export const selectNodeReducer = (
  state: EditorState,
  action: PayloadAction<string>
) => {
  state.selectedNodes =
    new Set([action.payload]);
};

/** Toggle node in selection */
export const toggleNodeSelectionReducer = (
  state: EditorState,
  action: PayloadAction<string>
) => {
  if (state.selectedNodes.has(action.payload)) {
    state.selectedNodes.delete(action.payload);
  } else {
    state.selectedNodes.add(action.payload);
  }
};

/** Clear all selections */
export const clearSelectionReducer = (
  state: EditorState
) => {
  state.selectedNodes.clear();
  state.selectedEdges.clear();
};

/** Set selection by node/edge arrays */
export const setSelectionReducer = (
  state: EditorState,
  action: PayloadAction<{
    nodes?: string[]; edges?: string[];
  }>
) => {
  if (action.payload.nodes) {
    state.selectedNodes =
      new Set(action.payload.nodes);
  }
  if (action.payload.edges) {
    state.selectedEdges =
      new Set(action.payload.edges);
  }
};
