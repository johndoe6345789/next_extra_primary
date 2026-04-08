/**
 * Bulk operation reducers for canvas items
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProjectCanvasItem } from '../types/project';

/** Canvas items state shape */
interface CanvasItemsState {
  canvasItems: ProjectCanvasItem[];
}

/** Bulk update canvas items */
export const bulkUpdateReducer = (
  state: CanvasItemsState,
  action: PayloadAction<Array<
    Partial<ProjectCanvasItem> & { id: string }
  >>
) => {
  action.payload.forEach((upd) => {
    const i = state.canvasItems.findIndex(
      (item) => item.id === upd.id
    );
    if (i !== -1) {
      state.canvasItems[i] = {
        ...state.canvasItems[i], ...upd
      };
    }
  });
};

/** Delete multiple canvas items */
export const deleteItemsReducer = (
  state: CanvasItemsState,
  action: PayloadAction<string[]>
) => {
  const ids = new Set(action.payload);
  state.canvasItems = state.canvasItems.filter(
    (i) => !ids.has(i.id)
  );
};

/** Duplicate canvas items with offset */
export const duplicateItemsReducer = (
  state: CanvasItemsState,
  action: PayloadAction<string[]>
) => {
  const ids = new Set(action.payload);
  const items = state.canvasItems.filter(
    (i) => ids.has(i.id)
  );
  const copies = items.map((item) => ({
    ...item,
    id: `${item.id}-copy-${Date.now()}`,
    position: {
      x: item.position.x + 20,
      y: item.position.y + 20
    }
  }));
  state.canvasItems.push(...copies);
};

/** Apply auto-layout positions */
export const applyAutoLayoutReducer = (
  state: CanvasItemsState,
  action: PayloadAction<Array<
    Partial<ProjectCanvasItem> & { id: string }
  >>
) => {
  action.payload.forEach((upd) => {
    const i = state.canvasItems.findIndex(
      (item) => item.id === upd.id
    );
    if (i !== -1 && upd.position) {
      state.canvasItems[i].position =
        upd.position;
    }
  });
};
