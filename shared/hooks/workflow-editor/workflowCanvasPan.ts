/**
 * Canvas pan interaction callbacks
 */

import { useState, useCallback } from 'react';

/** Hook for canvas pan state */
export function useCanvasPan(
  initialPan: { x: number; y: number }
) {
  const [pan, setPanState] =
    useState(initialPan);
  const [isPanning, setIsPanning] =
    useState(false);
  const [panStart, setPanStart] = useState({
    x: 0,
    y: 0,
  });

  const setPan = useCallback(
    (x: number, y: number) =>
      setPanState({ x, y }),
    []
  );
  const panBy = useCallback(
    (dx: number, dy: number) =>
      setPanState((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      })),
    []
  );
  const resetPan = useCallback(
    () => setPanState({ x: 0, y: 0 }),
    []
  );

  const startPan = useCallback(
    (cx: number, cy: number) => {
      setIsPanning(true);
      setPanStart({
        x: cx - pan.x,
        y: cy - pan.y,
      });
    },
    [pan]
  );

  const updatePan = useCallback(
    (cx: number, cy: number) => {
      if (isPanning)
        setPanState({
          x: cx - panStart.x,
          y: cy - panStart.y,
        });
    },
    [isPanning, panStart]
  );

  const endPan = useCallback(
    () => setIsPanning(false),
    []
  );

  return {
    pan,
    isPanning,
    setPan,
    panBy,
    resetPan,
    startPan,
    updatePan,
    endPan,
    setPanState,
  };
}
