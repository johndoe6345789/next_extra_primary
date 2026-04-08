import type { PanDelta }
  from './canvasTransformTypes';

/**
 * Create a mouse move handler for panning.
 * @param isPanning - Whether currently panning.
 * @param panStart - Starting mouse position.
 * @param panCanvas - Pan function.
 * @param setPanStart - Update start position.
 * @param pan - Current pan offset.
 * @param onCanvasPan - External pan callback.
 * @returns Mouse move handler function.
 */
export function createMoveHandler(
  isPanning: boolean,
  panStart: { x: number; y: number },
  panCanvas: (delta: PanDelta) => void,
  setPanStart: (
    pos: { x: number; y: number }
  ) => void,
  pan: PanDelta,
  onCanvasPan?: (pan: PanDelta) => void,
) {
  return (e: { clientX: number;
    clientY: number }) => {
    if (!isPanning) return;
    const delta = {
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    };
    panCanvas(delta);
    setPanStart({
      x: e.clientX, y: e.clientY,
    });
    onCanvasPan?.({
      x: pan.x + delta.x,
      y: pan.y + delta.y,
    });
  };
}
