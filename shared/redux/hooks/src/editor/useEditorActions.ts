/**
 * useEditor Canvas Actions
 * Context menu, canvas size, and
 * reset actions for the editor.
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@shared/redux-slices'
import {
  showContextMenu,
  hideContextMenu,
  setCanvasSize,
  resetEditor,
} from '@shared/redux-slices/editorSlice'
import type {
  UseEditorZoomReturn,
} from './useEditorZoom'
import type {
  UseEditorPanReturn,
} from './useEditorPan'
import {
  useEditorNavigation,
} from './useEditorNavigation'

/** @brief Create canvas actions for editor */
export function useEditorActions(
  zoomHook: UseEditorZoomReturn,
  panHook: UseEditorPanReturn
) {
  const dispatch = useDispatch()
  const canvasSize = useSelector(
    (state: RootState) =>
      state.editor.canvasSize
  )

  /** @brief Show context menu at position */
  const showMenu = useCallback(
    (x: number, y: number, nodeId?: string) => {
      dispatch(
        showContextMenu({ x, y, nodeId })
      )
    },
    [dispatch]
  )

  /** @brief Hide context menu */
  const hideMenu = useCallback(() => {
    dispatch(hideContextMenu())
  }, [dispatch])

  /** @brief Set canvas dimensions */
  const setSize = useCallback(
    (width: number, height: number) => {
      dispatch(setCanvasSize({ width, height }))
    },
    [dispatch]
  )

  const nav = useEditorNavigation(
    zoomHook, panHook, canvasSize
  )

  /** @brief Reset editor state */
  const reset = useCallback(() => {
    dispatch(resetEditor())
  }, [dispatch])

  return {
    canvasSize,
    showContextMenu: showMenu,
    hideContextMenu: hideMenu,
    setCanvasSize: setSize,
    fitToScreen: nav.fitToScreen,
    centerOnNode: nav.centerOnNode,
    reset,
  }
}
