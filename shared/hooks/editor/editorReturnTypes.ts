/**
 * Return type for useEditor hook
 */

import type {
  UseEditorZoomReturn,
} from './useEditorZoom';
import type {
  UseEditorPanReturn,
} from './useEditorPan';
import type {
  UseEditorNodesReturn,
} from './useEditorNodes';
import type {
  UseEditorEdgesReturn,
} from './useEditorEdges';
import type {
  UseEditorSelectionReturn,
} from './useEditorSelection';
import type {
  UseEditorClipboardReturn,
} from './useEditorClipboard';
import type {
  UseEditorHistoryReturn,
} from './useEditorHistory';

/** Return type of useEditor */
export interface UseEditorReturn {
  zoomHook: UseEditorZoomReturn;
  panHook: UseEditorPanReturn;
  nodesHook: UseEditorNodesReturn;
  edgesHook: UseEditorEdgesReturn;
  selectionHook: UseEditorSelectionReturn;
  clipboardHook: UseEditorClipboardReturn;
  historyHook: UseEditorHistoryReturn;
  zoom: number;
  pan: { x: number; y: number };
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  isDrawing: boolean;
  contextMenu: unknown;
  canvasSize: {
    width: number;
    height: number;
  };
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
  resetPan: () => void;
  showContextMenu: (
    x: number,
    y: number,
    nodeId?: string
  ) => void;
  hideContextMenu: () => void;
  setCanvasSize: (
    w: number,
    h: number
  ) => void;
  fitToScreen: () => void;
  centerOnNode: (
    id: string,
    nodes: unknown[]
  ) => void;
  reset: () => void;
}
