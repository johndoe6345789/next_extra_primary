/**
 * useEditor Types
 * Return type and composed hook types
 */

import type {
  UseEditorZoomReturn,
} from './useEditorZoom'
import type {
  UseEditorPanReturn,
} from './useEditorPan'
import type {
  UseEditorNodesReturn,
} from './useEditorNodes'
import type {
  UseEditorEdgesReturn,
} from './useEditorEdges'
import type {
  UseEditorSelectionReturn,
} from './useEditorSelection'
import type {
  UseEditorClipboardReturn,
} from './useEditorClipboard'
import type {
  UseEditorHistoryReturn,
} from './useEditorHistory'

/** @brief Full return type for useEditor */
export interface UseEditorReturn {
  zoomHook: UseEditorZoomReturn
  panHook: UseEditorPanReturn
  nodesHook: UseEditorNodesReturn
  edgesHook: UseEditorEdgesReturn
  selectionHook: UseEditorSelectionReturn
  clipboardHook: UseEditorClipboardReturn
  historyHook: UseEditorHistoryReturn
  zoom: number
  pan: { x: number; y: number }
  selectedNodes: Set<string>
  selectedEdges: Set<string>
  isDrawing: boolean
  contextMenu: any
  canvasSize: { width: number; height: number }
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetPan: () => void
  showContextMenu: (
    x: number,
    y: number,
    nodeId?: string
  ) => void
  hideContextMenu: () => void
  setCanvasSize: (
    width: number,
    height: number
  ) => void
  fitToScreen: () => void
  centerOnNode: (
    nodeId: string,
    nodes: any[]
  ) => void
  reset: () => void
}
