/**
 * Canvas selection and grid reducers
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProjectCanvasState } from '../types/project';

/** State wrapper */
interface CanvasViewState {
  canvasState: ProjectCanvasState;
}

/** Select a single canvas item */
export const selectCanvasItemReducer = (
  state: CanvasViewState,
  action: PayloadAction<string>
) => {
  state.canvasState.selectedItemIds.clear();
  state.canvasState.selectedItemIds.add(
    action.payload
  );
};

/** Add item to selection */
export const addToSelectionReducer = (
  state: CanvasViewState,
  action: PayloadAction<string>
) => {
  state.canvasState.selectedItemIds.add(
    action.payload
  );
};

/** Remove item from selection */
export const removeFromSelectionReducer = (
  state: CanvasViewState,
  action: PayloadAction<string>
) => {
  state.canvasState.selectedItemIds.delete(
    action.payload
  );
};

/** Toggle item selection */
export const toggleSelectionReducer = (
  state: CanvasViewState,
  action: PayloadAction<string>
) => {
  const ids = state.canvasState.selectedItemIds;
  if (ids.has(action.payload)) {
    ids.delete(action.payload);
  } else { ids.add(action.payload); }
};

/** Set entire selection set */
export const setSelectionReducer = (
  state: CanvasViewState,
  action: PayloadAction<Set<string>>
) => {
  state.canvasState.selectedItemIds =
    action.payload;
};

/** Clear all selections */
export const clearSelectionReducer = (
  state: CanvasViewState
) => {
  state.canvasState.selectedItemIds.clear();
};
