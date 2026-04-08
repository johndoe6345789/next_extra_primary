/**
 * Redux Slice for Canvas Items Management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectCanvasItem } from '../types/project';
import {
  bulkUpdateReducer, deleteItemsReducer,
  duplicateItemsReducer, applyAutoLayoutReducer
} from './canvasItemsBulkReducers';

interface CanvasItemsState {
  canvasItems: ProjectCanvasItem[];
}

export const canvasItemsSlice = createSlice({
  name: 'canvasItems',
  initialState: {
    canvasItems: []
  } as CanvasItemsState,
  reducers: {
    setCanvasItems: (
      state,
      action: PayloadAction<ProjectCanvasItem[]>
    ) => { state.canvasItems = action.payload; },
    addCanvasItem: (
      state,
      action: PayloadAction<ProjectCanvasItem>
    ) => { state.canvasItems.push(action.payload); },
    updateCanvasItem: (state, action: PayloadAction<
      Partial<ProjectCanvasItem> & { id: string }
    >) => {
      const i = state.canvasItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (i !== -1) {
        state.canvasItems[i] = {
          ...state.canvasItems[i],
          ...action.payload
        };
      }
    },
    removeCanvasItem: (
      state, action: PayloadAction<string>
    ) => {
      state.canvasItems = state.canvasItems.filter(
        (i) => i.id !== action.payload
      );
    },
    bulkUpdateCanvasItems: bulkUpdateReducer,
    deleteCanvasItems: deleteItemsReducer,
    duplicateCanvasItems: duplicateItemsReducer,
    applyAutoLayout: applyAutoLayoutReducer,
    clearCanvasItems: (state) => {
      state.canvasItems = [];
    }
  }
});

export const {
  setCanvasItems, addCanvasItem,
  updateCanvasItem, removeCanvasItem,
  bulkUpdateCanvasItems, deleteCanvasItems,
  duplicateCanvasItems, applyAutoLayout,
  clearCanvasItems
} = canvasItemsSlice.actions;

export {
  selectCanvasItems, selectCanvasItemCount,
  selectCanvasItemById, selectCanvasItemsByIds
} from './canvasItemsSelectors';

export default canvasItemsSlice.reducer;
