/**
 * useCanvasPan - Hook managing shift+drag
 * panning and document-level mouse listeners.
 */

import {
  useEffect, useCallback, useState,
} from 'react';
import { PanDelta }
  from './canvasTransformTypes';
import { createMoveHandler }
  from './canvasPanHandlers';

/** Shift+drag panning for the canvas. */
export function useCanvasPan(
  pan_canvas: (delta: PanDelta) => void,
  pan: PanDelta,
  onCanvasPan?: (pan: PanDelta) => void
) {
  const [isPanning, setIsPanning] =
    useState(false);
  const [panStart, setPanStart] =
    useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (e.shiftKey) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX, y: e.clientY,
        });
        e.preventDefault();
      }
    }, []);

  const handleMouseMove = useCallback(
    createMoveHandler(
      isPanning, panStart, pan_canvas,
      setPanStart, pan, onCanvasPan,
    ),
    [isPanning, panStart,
      pan_canvas, pan, onCanvasPan]);

  const handleMouseUp = useCallback(
    () => { setIsPanning(false); }, []);

  useEffect(() => {
    const move = handleMouseMove as
      unknown as EventListener;
    document.addEventListener(
      'mousemove', move);
    document.addEventListener(
      'mouseup', handleMouseUp);
    return () => {
      document.removeEventListener(
        'mousemove', move);
      document.removeEventListener(
        'mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isPanning, handleMouseDown,
    handleMouseMove, handleMouseUp,
  };
}
