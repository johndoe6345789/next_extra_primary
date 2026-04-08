/**
 * Canvas boolean flag reducers
 * Dragging, resizing, grid settings
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type {
  ProjectCanvasState,
} from '../types/project';

/** Canvas wrapper state */
interface CanvasSliceState {
  canvasState: ProjectCanvasState;
}

/** Set dragging flag */
export const setDraggingReducer = (
  state: CanvasSliceState,
  action: PayloadAction<boolean>
) => {
  state.canvasState.isDragging = action.payload;
};

/** Set resizing flag */
export const setResizingReducer = (
  state: CanvasSliceState,
  action: PayloadAction<boolean>
) => {
  state.canvasState.isResizing = action.payload;
};

/** Set grid snap flag */
export const setGridSnapReducer = (
  state: CanvasSliceState,
  action: PayloadAction<boolean>
) => {
  state.canvasState.gridSnap = action.payload;
};

/** Set show grid flag */
export const setShowGridReducer = (
  state: CanvasSliceState,
  action: PayloadAction<boolean>
) => {
  state.canvasState.showGrid = action.payload;
};
