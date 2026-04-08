/**
 * Canvas viewport reducers
 * Zoom, pan, snap size
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type {
  ProjectCanvasState, CanvasPosition,
} from '../types/project';

export {
  setDraggingReducer, setResizingReducer,
  setGridSnapReducer, setShowGridReducer,
} from './canvasFlagReducers';

/** Canvas wrapper state */
interface CanvasSliceState {
  canvasState: ProjectCanvasState;
}

/** Set zoom level (clamped 0.1-3) */
export const setCanvasZoomReducer = (
  state: CanvasSliceState,
  action: PayloadAction<number>
) => {
  state.canvasState.zoom = Math.max(
    0.1, Math.min(3, action.payload)
  );
};

/** Set pan position */
export const setCanvasPanReducer = (
  state: CanvasSliceState,
  action: PayloadAction<CanvasPosition>
) => {
  state.canvasState.pan = action.payload;
};

/** Pan by delta */
export const panCanvasReducer = (
  state: CanvasSliceState,
  action: PayloadAction<CanvasPosition>
) => {
  state.canvasState.pan.x += action.payload.x;
  state.canvasState.pan.y += action.payload.y;
};

/** Reset zoom and pan */
export const resetCanvasViewReducer = (
  state: CanvasSliceState
) => {
  state.canvasState.zoom = 1;
  state.canvasState.pan = { x: 0, y: 0 };
};

/** Set snap size (clamped 5-100) */
export const setSnapSizeReducer = (
  state: CanvasSliceState,
  action: PayloadAction<number>
) => {
  state.canvasState.snapSize = Math.max(
    5, Math.min(100, action.payload)
  );
};
