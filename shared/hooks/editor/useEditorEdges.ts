/**
 * useEditorEdges Hook
 * Manages editor edge selection and actions
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  RootState,
  EditorActions,
  UseEditorEdgesReturn,
  UseEditorEdgesOptions,
} from './editorEdgesTypes';

export type {
  EditorState,
  RootState,
  EditorActions,
  UseEditorEdgesReturn,
  UseEditorEdgesOptions,
} from './editorEdgesTypes';

/** Hook for editor edge operations */
export function useEditorEdges(
  options: UseEditorEdgesOptions
): UseEditorEdgesReturn {
  const { actions } = options;
  const dispatch = useDispatch();
  const selectedEdges = useSelector(
    (state: RootState) =>
      state.editor.selectedEdges
  );

  const selectEdge = useCallback(
    (edgeId: string) =>
      dispatch(actions.selectEdge(edgeId)),
    [dispatch, actions]
  );

  const addEdgeToSelection = useCallback(
    (edgeId: string) =>
      dispatch(
        actions.addEdgeToSelection(edgeId)
      ),
    [dispatch, actions]
  );

  const removeEdgeFromSelection = useCallback(
    (edgeId: string) =>
      dispatch(
        actions.removeEdgeFromSelection(edgeId)
      ),
    [dispatch, actions]
  );

  const clearSelection = useCallback(
    () => dispatch(actions.clearSelection()),
    [dispatch, actions]
  );

  const setEdgeSelection = useCallback(
    (edges: string[], nodes?: string[]) =>
      dispatch(
        actions.setSelection({ nodes, edges })
      ),
    [dispatch, actions]
  );

  return {
    selectedEdges,
    selectEdge,
    addEdgeToSelection,
    removeEdgeFromSelection,
    clearSelection,
    setEdgeSelection,
  };
}

export default useEditorEdges;
