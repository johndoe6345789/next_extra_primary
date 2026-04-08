/**
 * useWorkflowNodes Hook
 * Manages workflow node CRUD, selection, drag
 */

import { useState, useCallback } from 'react';
import type {
  WorkflowNode,
  UseWorkflowNodesReturn,
  UseWorkflowNodesOptions,
} from './workflowNodesTypes';
import { useNodeDrag } from './workflowNodesDrag';
import { useNodeCrud } from './workflowNodesCrud';
import {
  useNodeSelection,
} from './workflowNodesSelection';

export type {
  Position,
  WorkflowNode,
  UseWorkflowNodesReturn,
  UseWorkflowNodesOptions,
} from './workflowNodesTypes';

/** Hook for workflow node management */
export function useWorkflowNodes(
  opts: UseWorkflowNodesOptions = {}
): UseWorkflowNodesReturn {
  const { initialNodes = [], onNodesChange } =
    opts;

  const [nodes, setNodesState] =
    useState<WorkflowNode[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] =
    useState<string | null>(null);

  const update = useCallback(
    (
      fn: (
        p: WorkflowNode[]
      ) => WorkflowNode[]
    ) => {
      setNodesState((prev) => {
        const next = fn(prev);
        onNodesChange?.(next);
        return next;
      });
    },
    [onNodesChange]
  );

  const crud = useNodeCrud(
    update, setNodesState,
    selectedNodeId, setSelectedNodeId,
    onNodesChange
  );
  const drag = useNodeDrag(crud.moveNode);
  const selection = useNodeSelection(
    nodes, selectedNodeId, setSelectedNodeId
  );

  return {
    nodes, selectedNodeId,
    ...drag, ...crud, ...selection,
  };
}
