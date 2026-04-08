/**
 * Node CRUD callbacks
 */

import { useCallback } from 'react';
import type {
  WorkflowNode,
} from './workflowNodesTypes';
import { useNodeUpdaters } from './workflowNodesMove';

type Updater = (
  fn: (p: WorkflowNode[]) => WorkflowNode[]
) => void;
type SetState = React.Dispatch<
  React.SetStateAction<WorkflowNode[]>
>;

/** Create node CRUD callbacks */
export function useNodeCrud(
  update: Updater,
  setNodesState: SetState,
  selectedNodeId: string | null,
  setSelectedNodeId: (
    id: string | null
  ) => void,
  onNodesChange?: (
    ns: WorkflowNode[]
  ) => void
) {
  const addNode = useCallback(
    (node: WorkflowNode) =>
      update((p) => [...p, node]),
    [update]
  );

  const updateNode = useCallback(
    (
      id: string,
      upd: Partial<WorkflowNode>
    ) =>
      update((p) =>
        p.map((n) =>
          n.id === id
            ? { ...n, ...upd } : n
        )
      ),
    [update]
  );

  const deleteNode = useCallback(
    (id: string) => {
      update((p) =>
        p.filter((n) => n.id !== id)
      );
      if (selectedNodeId === id)
        setSelectedNodeId(null);
    },
    [
      update,
      selectedNodeId,
      setSelectedNodeId,
    ]
  );

  const setNodes = useCallback(
    (ns: WorkflowNode[]) => {
      setNodesState(ns);
      onNodesChange?.(ns);
    },
    [setNodesState, onNodesChange]
  );

  const movers = useNodeUpdaters(
    update, updateNode
  );

  return {
    addNode,
    updateNode,
    deleteNode,
    setNodes,
    ...movers,
  };
}
