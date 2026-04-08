/**
 * Node selection and query callbacks
 */

import { useCallback } from 'react';
import type {
  WorkflowNode,
} from './workflowNodesTypes';

/**
 * Build node selection and query helpers
 * @param nodes - Current nodes array
 * @param selectedNodeId - Selected node ID
 * @param setSelectedNodeId - Selection setter
 */
export function useNodeSelection(
  nodes: WorkflowNode[],
  selectedNodeId: string | null,
  setSelectedNodeId: (
    id: string | null
  ) => void
) {
  const selectNode = useCallback(
    (id: string | null) =>
      setSelectedNodeId(id),
    []
  );

  const clearSelection = useCallback(
    () => setSelectedNodeId(null),
    []
  );

  const getNode = useCallback(
    (id: string) =>
      nodes.find((n) => n.id === id),
    [nodes]
  );

  const getSelectedNode = useCallback(
    () =>
      selectedNodeId
        ? nodes.find(
            (n) => n.id === selectedNodeId
          )
        : undefined,
    [selectedNodeId, nodes]
  );

  return {
    selectNode,
    clearSelection,
    getNode,
    getSelectedNode,
  };
}
