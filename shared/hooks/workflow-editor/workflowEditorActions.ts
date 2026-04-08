/**
 * Workflow editor action callbacks
 */

import { useCallback } from 'react';
import type {
  WorkflowNode,
  Position,
  NodeTypeDefinition,
} from '../../types/workflow-editor';
import type {
  UseWorkflowNodesReturn,
} from './useWorkflowNodes';
import type {
  UseWorkflowConnectionsReturn,
} from './useWorkflowConnections';
import type {
  UseWorkflowPersistenceReturn,
} from './useWorkflowPersistence';
import {
  useSelectedNodeOps,
} from './workflowEditorNodeOps';

let nodeCounter = 0;
const generateNodeId = () =>
  `node_${++nodeCounter}_${Date.now()}`;

/** Create editor action callbacks */
export function useEditorActions(
  nodesHook: UseWorkflowNodesReturn,
  connectionsHook: UseWorkflowConnectionsReturn,
  persistenceHook: UseWorkflowPersistenceReturn
) {
  const addNodeFromPalette = useCallback(
    (
      nt: NodeTypeDefinition,
      pos: Position
    ): WorkflowNode => {
      const newNode: WorkflowNode = {
        id: generateNodeId(),
        type: nt.id,
        name: nt.name,
        position: pos,
        config: { ...nt.defaultConfig },
        inputs: [...nt.inputs],
        outputs: [...nt.outputs],
      };
      nodesHook.addNode(newNode);
      nodesHook.selectNode(newNode.id);
      persistenceHook.markDirty();
      return newNode;
    },
    [nodesHook, persistenceHook]
  );

  const nodeOps = useSelectedNodeOps(
    nodesHook,
    connectionsHook,
    persistenceHook
  );

  return {
    addNodeFromPalette,
    ...nodeOps,
  };
}
