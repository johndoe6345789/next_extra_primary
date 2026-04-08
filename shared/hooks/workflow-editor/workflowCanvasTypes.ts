/**
 * Types for useWorkflowCanvas
 */

export interface CanvasTransform {
  zoom: number;
  pan: { x: number; y: number };
}

export interface UseWorkflowCanvasReturn {
  zoom: number;
  pan: { x: number; y: number };
  isPanning: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  panBy: (dx: number, dy: number) => void;
  resetPan: () => void;
  startPan: (
    clientX: number,
    clientY: number
  ) => void;
  updatePan: (
    clientX: number,
    clientY: number
  ) => void;
  endPan: () => void;
  resetView: () => void;
  screenToCanvas: (
    sx: number,
    sy: number,
    rect: DOMRect
  ) => { x: number; y: number };
  canvasToScreen: (
    cx: number,
    cy: number,
    rect: DOMRect
  ) => { x: number; y: number };
}

export interface UseWorkflowCanvasOptions {
  initialZoom?: number;
  initialPan?: { x: number; y: number };
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}
