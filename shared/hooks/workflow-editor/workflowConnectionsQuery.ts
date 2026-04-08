/**
 * Connection query and cleanup callbacks
 */

import { useCallback } from 'react';
import type { Connection } from './workflowConnectionsTypes';

/** Create connection query callbacks */
export function useConnectionQueries(
  connections: Connection[],
  update: (
    fn: (p: Connection[]) => Connection[]
  ) => void
) {
  const getNodeConnections = useCallback(
    (id: string) =>
      connections.filter(
        (c) =>
          c.sourceNodeId === id ||
          c.targetNodeId === id
      ),
    [connections]
  );

  const getOutgoingConnections = useCallback(
    (id: string) =>
      connections.filter(
        (c) => c.sourceNodeId === id
      ),
    [connections]
  );

  const getIncomingConnections = useCallback(
    (id: string) =>
      connections.filter(
        (c) => c.targetNodeId === id
      ),
    [connections]
  );

  const removeNodeConnections = useCallback(
    (id: string) =>
      update((p) =>
        p.filter(
          (c) =>
            c.sourceNodeId !== id &&
            c.targetNodeId !== id
        )
      ),
    [update]
  );

  return {
    getNodeConnections,
    getOutgoingConnections,
    getIncomingConnections,
    removeNodeConnections,
  };
}
