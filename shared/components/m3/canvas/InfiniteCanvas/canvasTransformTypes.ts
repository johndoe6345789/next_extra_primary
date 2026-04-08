/**
 * Types for canvas transform operations.
 */

/** Delta coordinates for pan operations. */
export interface PanDelta {
  x: number;
  y: number;
}

/** Return type of the useCanvasTransform hook. */
export interface UseCanvasTransformReturn {
  isPanning: boolean;
  handleMouseDown: (
    e: React.MouseEvent
  ) => void;
  handleMouseMove: (
    e: React.MouseEvent
  ) => void;
  handleMouseUp: () => void;
  handleArrowPan: (
    direction: 'up' | 'down' | 'left' | 'right'
  ) => void;
  bindWheelListener: (
    element: HTMLDivElement | null
  ) => () => void;
}

/** Amount in pixels for arrow-key panning. */
export const PAN_AMOUNT = 100;

/** Direction-to-delta map for arrow panning. */
export const PAN_DELTAS: Record<
  string,
  PanDelta
> = {
  up: { x: 0, y: PAN_AMOUNT },
  down: { x: 0, y: -PAN_AMOUNT },
  left: { x: PAN_AMOUNT, y: 0 },
  right: { x: -PAN_AMOUNT, y: 0 },
};
