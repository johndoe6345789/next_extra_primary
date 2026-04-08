/**
 * Editor Redux Slice
 * Manages canvas state: zoom, pan, selection
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import { editorInitialState } from './editorTypes';
import {
  selectNodeReducer, toggleNodeSelectionReducer,
  clearSelectionReducer, setSelectionReducer,
} from './editorSelectionReducers';

export type { EditorState } from './editorTypes';

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorInitialState,
  reducers: {
    setZoom: (
      state, action: PayloadAction<number>
    ) => {
      state.zoom = Math.max(
        0.1, Math.min(2, action.payload)
      );
    },
    zoomIn: (state) => {
      state.zoom = Math.min(2, state.zoom + 0.1);
    },
    zoomOut: (state) => {
      state.zoom = Math.max(
        0.1, state.zoom - 0.1
      );
    },
    resetZoom: (state) => { state.zoom = 1; },
    setPan: (state, action: PayloadAction<{
      x: number; y: number;
    }>) => { state.pan = action.payload; },
    panBy: (state, action: PayloadAction<{
      dx: number; dy: number;
    }>) => {
      state.pan.x += action.payload.dx;
      state.pan.y += action.payload.dy;
    },
    selectNode: selectNodeReducer,
    toggleNodeSelection:
      toggleNodeSelectionReducer,
    clearSelection: clearSelectionReducer,
    setSelection: setSelectionReducer,
    setDrawing: (
      state, action: PayloadAction<boolean>
    ) => { state.isDrawing = action.payload; },
    showContextMenu: (
      state,
      action: PayloadAction<{
        x: number; y: number; nodeId?: string;
      }>
    ) => {
      state.contextMenu = {
        visible: true, ...action.payload,
      };
    },
    hideContextMenu: (state) => {
      state.contextMenu.visible = false;
    },
    setCanvasSize: (
      state,
      action: PayloadAction<{
        width: number; height: number;
      }>
    ) => { state.canvasSize = action.payload; },
    resetEditor: () => editorInitialState,
  },
});

export const {
  setZoom, zoomIn, zoomOut, resetZoom,
  setPan, panBy,
  selectNode, toggleNodeSelection,
  clearSelection, setSelection,
  setDrawing, showContextMenu, hideContextMenu,
  setCanvasSize, resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
