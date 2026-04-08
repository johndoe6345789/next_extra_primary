/**
 * useEditorNodes Hook
 * Manages editor node selection state
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  RootState,
  UseEditorNodesReturn,
  UseEditorNodesOptions,
} from './editorNodesTypes';

export type {
  UseEditorNodesReturn,
  UseEditorNodesOptions,
} from './editorNodesTypes';

/** Hook for editor node selection */
export function useEditorNodes(
  options: UseEditorNodesOptions
): UseEditorNodesReturn {
  const { actions } = options;
  const dispatch = useDispatch();
  const selectedNodes = useSelector(
    (s: RootState) => s.editor.selectedNodes
  );

  const selectNode = useCallback(
    (id: string) =>
      dispatch(actions.selectNode(id)),
    [dispatch, actions]
  );
  const addNodeToSelection = useCallback(
    (id: string) =>
      dispatch(actions.addNodeToSelection(id)),
    [dispatch, actions]
  );
  const removeNodeFromSelection = useCallback(
    (id: string) =>
      dispatch(
        actions.removeNodeFromSelection(id)
      ),
    [dispatch, actions]
  );
  const toggleNodeSelection = useCallback(
    (id: string) =>
      dispatch(
        actions.toggleNodeSelection(id)
      ),
    [dispatch, actions]
  );
  const clearSelection = useCallback(
    () => dispatch(actions.clearSelection()),
    [dispatch, actions]
  );
  const setNodeSelection = useCallback(
    (nodes: string[], edges?: string[]) =>
      dispatch(
        actions.setSelection({ nodes, edges })
      ),
    [dispatch, actions]
  );

  return {
    selectedNodes,
    selectNode,
    addNodeToSelection,
    removeNodeFromSelection,
    toggleNodeSelection,
    clearSelection,
    setNodeSelection,
  };
}

export default useEditorNodes;
