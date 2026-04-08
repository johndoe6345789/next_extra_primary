/**
 * Selectors for canvas items state
 */

import type { ProjectCanvasItem } from '../types/project';

/** Canvas items state shape */
interface CanvasItemsState {
  canvasItems: ProjectCanvasItem[];
}

/** Select all canvas items */
export const selectCanvasItems = (
  state: { canvasItems: CanvasItemsState }
) => state.canvasItems.canvasItems;

/** Select canvas item count */
export const selectCanvasItemCount = (
  state: { canvasItems: CanvasItemsState }
) => state.canvasItems.canvasItems.length;

/** Select canvas item by ID */
export const selectCanvasItemById = (
  state: { canvasItems: CanvasItemsState },
  itemId: string
) =>
  state.canvasItems.canvasItems.find(
    (item) => item.id === itemId
  );

/** Select canvas items by IDs */
export const selectCanvasItemsByIds = (
  state: { canvasItems: CanvasItemsState },
  itemIds: string[]
) => {
  const idSet = new Set(itemIds);
  return state.canvasItems.canvasItems.filter(
    (item) => idSet.has(item.id)
  );
};
