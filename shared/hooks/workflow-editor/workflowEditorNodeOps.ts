/**
 * Selected-node action callbacks
 */

import { useCallback } from 'react';
import type {
  UseWorkflowNodesReturn,
} from './useWorkflowNodes';
import type {
  UseWorkflowPersistenceReturn,
} from './useWorkflowPersistence';
import type {
  UseWorkflowConnectionsReturn,
} from './useWorkflowConnections';

/** Callbacks for selected node operations */
export function useSelectedNodeOps(
  nodesHook: UseWorkflowNodesReturn,
  connectionsHook: UseWorkflowConnectionsReturn,
  persistenceHook: UseWorkflowPersistenceReturn
) {
  const deleteSelectedNode = useCallback(
    () => {
      if (nodesHook.selectedNodeId) {
        connectionsHook.removeNodeConnections(
          nodesHook.selectedNodeId
        );
        nodesHook.deleteNode(
          nodesHook.selectedNodeId
        );
        persistenceHook.markDirty();
      }
    },
    [nodesHook, connectionsHook, persistenceHook]
  );

  const updateSelectedNodeConfig = useCallback(
    (cfg: Record<string, unknown>) => {
      if (nodesHook.selectedNodeId) {
        nodesHook.updateNodeConfig(
          nodesHook.selectedNodeId,
          cfg
        );
        persistenceHook.markDirty();
      }
    },
    [nodesHook, persistenceHook]
  );

  const updateSelectedNodeName = useCallback(
    (name: string) => {
      if (nodesHook.selectedNodeId) {
        nodesHook.updateNodeName(
          nodesHook.selectedNodeId,
          name
        );
        persistenceHook.markDirty();
      }
    },
    [nodesHook, persistenceHook]
  );

  return {
    deleteSelectedNode,
    updateSelectedNodeConfig,
    updateSelectedNodeName,
  };
}
