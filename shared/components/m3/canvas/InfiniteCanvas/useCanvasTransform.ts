/**
 * useCanvasTransform Hook
 * Combines wheel zoom, shift+drag panning,
 * and arrow key navigation.
 */

import { useCallback } from 'react';
import { useProjectCanvas } from '@shared/hooks-canvas';
import {
  PanDelta,
  PAN_DELTAS,
  UseCanvasTransformReturn,
} from './canvasTransformTypes';
import { useCanvasPan } from './useCanvasPan';

/** Zoom and pan interactions for the canvas. */
export function useCanvasTransform(
  onCanvasPan?: (pan: PanDelta) => void,
  onCanvasZoom?: (zoom: number) => void
): UseCanvasTransformReturn {
  const { zoom, pan, pan_canvas } =
    useProjectCanvas();

  const {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasPan(pan_canvas, pan, onCanvasPan);

  const bindWheelListener = useCallback(
    (element: HTMLDivElement | null) => {
      const handleWheel = (e: WheelEvent) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(
          0.1,
          Math.min(3, zoom * delta)
        );
        onCanvasZoom?.(newZoom);
      };
      if (element) {
        element.addEventListener(
          'wheel',
          handleWheel,
          { passive: false }
        );
        return () =>
          element.removeEventListener(
            'wheel',
            handleWheel
          );
      }
      return () => {};
    },
    [zoom, onCanvasZoom]
  );

  const handleArrowPan = useCallback(
    (
      direction:
        | 'up'
        | 'down'
        | 'left'
        | 'right'
    ) => {
      pan_canvas(PAN_DELTAS[direction]);
    },
    [pan_canvas]
  );

  return {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleArrowPan,
    bindWheelListener,
  };
}

export default useCanvasTransform;
