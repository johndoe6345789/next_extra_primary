/**
 * Resize handler logic for useDragResize
 */

import type { DragResizeItem } from './dragResizeTypes';

interface ResizeCalcInput {
  item: DragResizeItem;
  scaledDelta: { x: number; y: number };
  resizeDirection: string;
  minWidth: number;
  minHeight: number;
}

interface ResizeCalcResult {
  newWidth: number;
  newHeight: number;
  newX: number;
  newY: number;
}

/**
 * Calculate new size and position
 * after a resize drag movement
 */
export function calculateResize(
  input: ResizeCalcInput
): ResizeCalcResult {
  const {
    item,
    scaledDelta,
    resizeDirection,
    minWidth,
    minHeight,
  } = input;

  let newWidth = item.size.width;
  let newHeight = item.size.height;
  let newX = item.position.x;
  let newY = item.position.y;

  if (resizeDirection.includes('e')) {
    newWidth = Math.max(
      minWidth,
      item.size.width + scaledDelta.x
    );
  }
  if (resizeDirection.includes('s')) {
    newHeight = Math.max(
      minHeight,
      item.size.height + scaledDelta.y
    );
  }
  if (resizeDirection.includes('w')) {
    const dw = -scaledDelta.x;
    newWidth = Math.max(
      minWidth,
      item.size.width + dw
    );
    if (newWidth > minWidth) {
      newX = item.position.x - dw;
    }
  }
  if (resizeDirection.includes('n')) {
    const dh = -scaledDelta.y;
    newHeight = Math.max(
      minHeight,
      item.size.height + dh
    );
    if (newHeight > minHeight) {
      newY = item.position.y - dh;
    }
  }

  return { newWidth, newHeight, newX, newY };
}
