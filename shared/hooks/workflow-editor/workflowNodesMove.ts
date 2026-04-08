/**
 * Node movement and config update callbacks
 */

import { useCallback } from 'react';
import type {
  Position,
  WorkflowNode,
} from './workflowNodesTypes';

type Updater = (
  fn: (p: WorkflowNode[]) => WorkflowNode[]
) => void;

/** Create node move/config/name callbacks */
export function useNodeUpdaters(
  update: Updater,
  updateNode: (
    id: string,
    upd: Partial<WorkflowNode>
  ) => void
) {
  const moveNode = useCallback(
    (id: string, pos: Position) =>
      update((p) =>
        p.map((n) =>
          n.id === id
            ? {
                ...n,
                position: {
                  x: Math.max(0, pos.x),
                  y: Math.max(0, pos.y),
                },
              }
            : n
        )
      ),
    [update]
  );

  const updateNodeConfig = useCallback(
    (
      id: string,
      c: Record<string, unknown>
    ) => updateNode(id, { config: c }),
    [updateNode]
  );

  const updateNodeName = useCallback(
    (id: string, name: string) =>
      updateNode(id, { name }),
    [updateNode]
  );

  return {
    moveNode,
    updateNodeConfig,
    updateNodeName,
  };
}
