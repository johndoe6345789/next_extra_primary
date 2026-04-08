/**
 * Selectors for canvas viewport state
 */

import type { ProjectCanvasState } from '../types/project';

/** Canvas view state shape */
interface CanvasViewState {
  canvasState: ProjectCanvasState;
}

/** Select canvas state root */
const selectCanvasState = (
  state: { canvas: CanvasViewState }
) => state.canvas.canvasState;

/** Select zoom level */
export const selectCanvasZoom = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).zoom;

/** Select pan position */
export const selectCanvasPan = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).pan;

/** Select grid snap enabled */
export const selectGridSnap = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).gridSnap;

/** Select show grid flag */
export const selectShowGrid = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).showGrid;

/** Select snap size */
export const selectSnapSize = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).snapSize;

/** Select dragging state */
export const selectIsDragging = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).isDragging;

/** Select resizing state */
export const selectIsResizing = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).isResizing;

/** Select selected item IDs set */
export const selectSelectedItemIds = (
  state: { canvas: CanvasViewState }
) => selectCanvasState(state).selectedItemIds;
