/**
 * useWorkflowCanvas Hook
 * Manages zoom, pan, and coordinate transforms
 */

import { useState, useCallback } from 'react';
import type {
  UseWorkflowCanvasReturn,
  UseWorkflowCanvasOptions,
} from './workflowCanvasTypes';
import { useCanvasPan } from './workflowCanvasPan';
import { useCanvasCoords } from './workflowCanvasCoords';

export type {
  CanvasTransform,
  UseWorkflowCanvasReturn,
  UseWorkflowCanvasOptions,
} from './workflowCanvasTypes';

/** Hook for workflow canvas transforms */
export function useWorkflowCanvas(
  opts: UseWorkflowCanvasOptions = {}
): UseWorkflowCanvasReturn {
  const {
    initialZoom = 1,
    initialPan = { x: 0, y: 0 },
    minZoom = 0.25,
    maxZoom = 2,
    zoomStep = 0.25,
  } = opts;

  const [zoom, setZoomState] =
    useState(initialZoom);

  const clamp = useCallback(
    (v: number) =>
      Math.min(maxZoom, Math.max(minZoom, v)),
    [minZoom, maxZoom]
  );
  const zoomIn = useCallback(
    () =>
      setZoomState((p) => clamp(p + zoomStep)),
    [clamp, zoomStep]
  );
  const zoomOut = useCallback(
    () =>
      setZoomState((p) => clamp(p - zoomStep)),
    [clamp, zoomStep]
  );
  const resetZoom = useCallback(
    () => setZoomState(1),
    []
  );
  const setZoom = useCallback(
    (v: number) => setZoomState(clamp(v)),
    [clamp]
  );

  const panOps = useCanvasPan(initialPan);
  const coords = useCanvasCoords(
    panOps.pan,
    zoom
  );

  const resetView = useCallback(() => {
    setZoomState(1);
    panOps.setPanState({ x: 0, y: 0 });
  }, [panOps]);

  return {
    zoom,
    pan: panOps.pan,
    isPanning: panOps.isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    setPan: panOps.setPan,
    panBy: panOps.panBy,
    resetPan: panOps.resetPan,
    startPan: panOps.startPan,
    updatePan: panOps.updatePan,
    endPan: panOps.endPan,
    resetView,
    ...coords,
  };
}
