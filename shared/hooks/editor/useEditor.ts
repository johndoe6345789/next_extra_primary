/**
 * useEditor Hook (Composition)
 * Composes all editor hooks into one interface
 */

import { useEditorZoom } from './useEditorZoom';
import { useEditorPan } from './useEditorPan';
import { useEditorNodes } from './useEditorNodes';
import { useEditorEdges } from './useEditorEdges';
import { useEditorSelection } from './useEditorSelection';
import { useEditorClipboard } from './useEditorClipboard';
import { useEditorHistory } from './useEditorHistory';
import { useEditorCanvasActions } from './editorActions';
import type {
  UseEditorReturn,
  UseEditorOptions,
} from './editorTypes';

export type {
  EditorState,
  RootState,
  EditorActions,
  UseEditorReturn,
  UseEditorOptions,
} from './editorTypes';

/** Master editor composition hook */
export function useEditor(
  options: UseEditorOptions
): UseEditorReturn {
  const { actions } = options;

  const zoomHook = useEditorZoom({ actions });
  const panHook = useEditorPan({ actions });
  const nodesHook = useEditorNodes({ actions });
  const edgesHook = useEditorEdges({ actions });
  const selectionHook = useEditorSelection({
    actions,
  });
  const clipboardHook = useEditorClipboard();
  const historyHook = useEditorHistory();
  const canvas = useEditorCanvasActions(
    actions,
    zoomHook,
    panHook
  );

  return {
    zoomHook,
    panHook,
    nodesHook,
    edgesHook,
    selectionHook,
    clipboardHook,
    historyHook,
    zoom: zoomHook.zoom,
    pan: panHook.pan,
    selectedNodes: nodesHook.selectedNodes,
    selectedEdges: edgesHook.selectedEdges,
    isDrawing: selectionHook.isDrawing,
    contextMenu: canvas.contextMenu,
    canvasSize: canvas.canvasSize,
    zoomIn: zoomHook.zoomIn,
    zoomOut: zoomHook.zoomOut,
    resetZoom: zoomHook.resetZoom,
    setZoom: zoomHook.setZoom,
    setPan: panHook.setPan,
    resetPan: panHook.resetPan,
    showContextMenu: canvas.showContextMenu,
    hideContextMenu: canvas.hideContextMenu,
    setCanvasSize: canvas.setCanvasSize,
    fitToScreen: canvas.fitToScreen,
    centerOnNode: canvas.centerOnNode,
    reset: canvas.reset,
  };
}

export default useEditor;
