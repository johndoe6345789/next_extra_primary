/**
 * useDragResize Hook
 * Drag and resize logic for components
 */

import { useRef } from 'react';
import type {
  UseDragResizeParams,
  UseDragResizeReturn,
} from './dragResizeTypes';
import {
  MIN_WIDTH,
  MIN_HEIGHT,
} from './dragResizeTypes';
import { useDragMovement } from './useDragResizeDrag';
import { useResizeMovement } from './useDragResizeResize';

export type {
  DragResizeItem,
  UseDragResizeParams,
  UseDragResizeReturn,
} from './dragResizeTypes';

export const useDragResize = ({
  item,
  zoom = 1,
  snapToGrid = (pos) => pos,
  onUpdatePosition,
  onUpdateSize,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  minWidth = MIN_WIDTH,
  minHeight = MIN_HEIGHT,
}: UseDragResizeParams): UseDragResizeReturn => {
  const cardRef = useRef<HTMLDivElement>(null);

  const drag = useDragMovement(
    item, zoom, snapToGrid,
    onUpdatePosition, onDragStart, onDragEnd
  );

  const resize = useResizeMovement(
    item, zoom,
    drag.dragStart, drag.setDragStart,
    minWidth, minHeight,
    onUpdateSize, onUpdatePosition,
    onResizeStart, onResizeEnd
  );

  return {
    cardRef,
    isDragging: drag.isDragging,
    isResizing: resize.isResizing,
    handleDragStart: drag.handleDragStart,
    handleResizeStart: resize.handleResizeStart,
  };
};

export default useDragResize;
