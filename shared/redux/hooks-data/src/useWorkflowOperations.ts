/**
 * Workflow mutation operations
 */

import { useCallback, useRef, useEffect } from
  'react';
import { useDispatch } from 'react-redux';
import {
  addNode, updateNode, deleteNode,
  addConnection, removeConnection,
  setSaving,
} from '@shared/redux-slices';
import type {
  Workflow, WorkflowNode,
  WorkflowConnection,
} from '@shared/types';
import type { AppDispatch } from
  '@shared/redux-slices';

/** Workflow node/connection editing */
export function useWorkflowOperations(
  workflow: Workflow | null,
  isDirty: boolean,
  isSaving: boolean
) {
  const dispatch = useDispatch<AppDispatch>();
  const saveRef = useRef<
    NodeJS.Timeout | undefined
  >(undefined);

  const autoSave = useCallback(() => {
    if (saveRef.current)
      clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      if (workflow && isDirty && !isSaving)
        dispatch(setSaving(true));
    }, 2000);
  }, [workflow, isDirty, isSaving, dispatch]);

  const save = useCallback(async () => {
    if (workflow && isDirty)
      dispatch(setSaving(true));
  }, [workflow, isDirty, dispatch]);

  const addNodeToWf = useCallback(
    (node: WorkflowNode) => {
      dispatch(addNode(node)); autoSave();
    }, [dispatch, autoSave]);

  const updateNodeData = useCallback(
    (id: string, data: Partial<WorkflowNode>) => {
      dispatch(updateNode({ id, data }));
      autoSave();
    }, [dispatch, autoSave]);

  const removeNodeFromWf = useCallback(
    (id: string) => {
      dispatch(deleteNode(id)); autoSave();
    }, [dispatch, autoSave]);

  const addConn = useCallback(
    (conn: WorkflowConnection) => {
      dispatch(addConnection(conn)); autoSave();
    }, [dispatch, autoSave]);

  const removeConn = useCallback(
    (source: string, target: string) => {
      dispatch(removeConnection({
        source, target }));
      autoSave();
    }, [dispatch, autoSave]);

  useEffect(() => {
    return () => {
      if (saveRef.current)
        clearTimeout(saveRef.current);
    };
  }, []);

  return {
    save, autoSave,
    addNode: addNodeToWf,
    updateNode: updateNodeData,
    removeNode: removeNodeFromWf,
    addConnection: addConn,
    removeConnection: removeConn,
  };
}
