/**
 * useEditor Hook (Composition)
 * Composes all focused editor hooks into
 * a single backward-compatible interface.
 */

import { useSelector } from 'react-redux'
import { RootState } from '@shared/redux-slices'
import { useEditorZoom } from './useEditorZoom'
import { useEditorPan } from './useEditorPan'
import { useEditorNodes } from './useEditorNodes'
import { useEditorEdges } from './useEditorEdges'
import { useEditorSelection } from './useEditorSelection'
import { useEditorClipboard } from './useEditorClipboard'
import { useEditorHistory } from './useEditorHistory'
import { useEditorActions } from './useEditorActions'
import type { UseEditorReturn } from './useEditorTypes'

export type { UseEditorReturn } from './useEditorTypes'

/** @brief Composed editor hook */
export function useEditor(): UseEditorReturn {
  const zoomHook = useEditorZoom()
  const panHook = useEditorPan()
  const nodesHook = useEditorNodes()
  const edgesHook = useEditorEdges()
  const selectionHook = useEditorSelection()
  const clipboardHook = useEditorClipboard()
  const historyHook = useEditorHistory()

  const contextMenu = useSelector(
    (state: RootState) =>
      state.editor.contextMenu
  )

  const actions = useEditorActions(
    zoomHook,
    panHook
  )

  return {
    zoomHook, panHook, nodesHook,
    edgesHook, selectionHook,
    clipboardHook, historyHook,
    zoom: zoomHook.zoom,
    pan: panHook.pan,
    selectedNodes: nodesHook.selectedNodes,
    selectedEdges: edgesHook.selectedEdges,
    isDrawing: selectionHook.isDrawing,
    contextMenu,
    canvasSize: actions.canvasSize,
    zoomIn: zoomHook.zoomIn,
    zoomOut: zoomHook.zoomOut,
    resetZoom: zoomHook.resetZoom,
    setZoom: zoomHook.setZoom,
    setPan: panHook.setPan,
    resetPan: panHook.resetPan,
    showContextMenu: actions.showContextMenu,
    hideContextMenu: actions.hideContextMenu,
    setCanvasSize: actions.setCanvasSize,
    fitToScreen: actions.fitToScreen,
    centerOnNode: actions.centerOnNode,
    reset: actions.reset,
  }
}

export default useEditor
