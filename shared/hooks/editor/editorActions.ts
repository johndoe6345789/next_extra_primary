/**
 * Canvas/context-menu actions for useEditor
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  RootState,
  EditorActions,
} from './editorTypes';
import type {
  UseEditorZoomReturn,
} from './useEditorZoom';
import type {
  UseEditorPanReturn,
} from './useEditorPan';
import {
  useCenterCallbacks,
} from './editorCenterNode';

/** Create canvas and menu callbacks */
export function useEditorCanvasActions(
  actions: EditorActions,
  zoomHook: UseEditorZoomReturn,
  panHook: UseEditorPanReturn
) {
  const dispatch = useDispatch();
  const contextMenu = useSelector(
    (s: RootState) => s.editor.contextMenu
  );
  const canvasSize = useSelector(
    (s: RootState) => s.editor.canvasSize
  );

  const showContextMenu = useCallback(
    (x: number, y: number, nodeId?: string) =>
      dispatch(
        actions.showContextMenu({
          x, y, nodeId,
        })
      ),
    [dispatch, actions]
  );

  const hideContextMenu = useCallback(
    () => dispatch(actions.hideContextMenu()),
    [dispatch, actions]
  );

  const setCanvasSize = useCallback(
    (w: number, h: number) =>
      dispatch(
        actions.setCanvasSize({
          width: w, height: h,
        })
      ),
    [dispatch, actions]
  );

  const { fitToScreen, centerOnNode } =
    useCenterCallbacks(
      canvasSize, zoomHook, panHook
    );

  const reset = useCallback(
    () => dispatch(actions.resetEditor()),
    [dispatch, actions]
  );

  return {
    contextMenu, canvasSize,
    showContextMenu, hideContextMenu,
    setCanvasSize, fitToScreen,
    centerOnNode, reset,
  };
}
