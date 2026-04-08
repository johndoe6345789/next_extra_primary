/**
 * Canvas coordinate conversion callbacks
 */

import { useCallback } from 'react';

/** Create screen/canvas converters */
export function useCanvasCoords(
  pan: { x: number; y: number },
  zoom: number
) {
  const screenToCanvas = useCallback(
    (
      sx: number,
      sy: number,
      r: DOMRect
    ) => ({
      x: (sx - r.left - pan.x) / zoom,
      y: (sy - r.top - pan.y) / zoom,
    }),
    [pan, zoom]
  );

  const canvasToScreen = useCallback(
    (
      cx: number,
      cy: number,
      r: DOMRect
    ) => ({
      x: cx * zoom + pan.x + r.left,
      y: cy * zoom + pan.y + r.top,
    }),
    [pan, zoom]
  );

  return { screenToCanvas, canvasToScreen };
}
