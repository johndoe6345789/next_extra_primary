/**
 * Canvas-related exports
 */

export { canvasSlice } from '../slices/canvasSlice';
export {
  setCanvasZoom, setCanvasPan, panCanvas,
  selectCanvasItem, addToSelection,
  toggleSelection, clearSelection,
  setDragging, setResizing,
  setGridSnap, setShowGrid, setSnapSize,
  resetCanvasView, removeFromSelection,
  setSelection, resetCanvasState
} from '../slices/canvasSlice';

export {
  selectCanvasZoom, selectCanvasPan,
  selectGridSnap, selectShowGrid, selectSnapSize,
  selectIsDragging, selectIsResizing,
  selectSelectedItemIds
} from '../slices/canvasSlice';

export { canvasItemsSlice } from '../slices/canvasItemsSlice';
export {
  setCanvasItems, addCanvasItem,
  updateCanvasItem, removeCanvasItem,
  bulkUpdateCanvasItems, deleteCanvasItems,
  duplicateCanvasItems, applyAutoLayout,
  clearCanvasItems
} from '../slices/canvasItemsSlice';

export {
  selectCanvasItems, selectCanvasItemCount,
  selectCanvasItemById, selectCanvasItemsByIds
} from '../slices/canvasItemsSlice';
