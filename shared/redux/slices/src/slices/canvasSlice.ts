/**
 * Redux Slice for Canvas Viewport State
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type { ProjectCanvasState } from
  '../types/project';
import {
  selectCanvasItemReducer, addToSelectionReducer,
  removeFromSelectionReducer,
  toggleSelectionReducer, setSelectionReducer,
  clearSelectionReducer,
} from './canvasReducers';
import {
  setCanvasZoomReducer, setCanvasPanReducer,
  panCanvasReducer, resetCanvasViewReducer,
  setSnapSizeReducer, setDraggingReducer,
  setResizingReducer, setGridSnapReducer,
  setShowGridReducer,
} from './canvasViewportReducers';

const initial: ProjectCanvasState = {
  zoom: 1, pan: { x: 0, y: 0 },
  selectedItemIds: new Set<string>(),
  isDragging: false, isResizing: false,
  gridSnap: true, showGrid: true, snapSize: 20,
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState: { canvasState: initial },
  reducers: {
    setCanvasZoom: setCanvasZoomReducer,
    setCanvasPan: setCanvasPanReducer,
    panCanvas: panCanvasReducer,
    resetCanvasView: resetCanvasViewReducer,
    selectCanvasItem: selectCanvasItemReducer,
    addToSelection: addToSelectionReducer,
    removeFromSelection:
      removeFromSelectionReducer,
    toggleSelection: toggleSelectionReducer,
    setSelection: setSelectionReducer,
    clearSelection: clearSelectionReducer,
    setDragging: setDraggingReducer,
    setResizing: setResizingReducer,
    setGridSnap: setGridSnapReducer,
    setShowGrid: setShowGridReducer,
    setSnapSize: setSnapSizeReducer,
    resetCanvasState: (state) => {
      state.canvasState = initial;
    },
  },
});

export const {
  setCanvasZoom, setCanvasPan, panCanvas,
  resetCanvasView, selectCanvasItem,
  addToSelection, removeFromSelection,
  toggleSelection, setSelection, clearSelection,
  setDragging, setResizing, setGridSnap,
  setShowGrid, setSnapSize, resetCanvasState
} = canvasSlice.actions;

export {
  selectCanvasZoom, selectCanvasPan,
  selectGridSnap, selectShowGrid, selectSnapSize,
  selectIsDragging, selectIsResizing,
  selectSelectedItemIds
} from './canvasSelectors';

export default canvasSlice.reducer;
