/**
 * Connection initialization and duplicate check
 */

import { useState, useCallback } from 'react';
import type { Connection } from './workflowConnectionsTypes';

let connCounter = 0;

/** Default connection ID generator */
export const defaultGenId = () =>
  `conn_${++connCounter}_${Date.now()}`;

/**
 * Initialize connection state and updater
 * @param initialConnections - Starting set
 * @param onConnectionsChange - Change callback
 */
export function useConnectionState(
  initialConnections: Connection[],
  onConnectionsChange?: (c: Connection[]) => void
) {
  const [connections, setConns] =
    useState<Connection[]>(initialConnections);

  const update = useCallback(
    (
      fn: (p: Connection[]) => Connection[]
    ) => {
      setConns((prev) => {
        const next = fn(prev);
        onConnectionsChange?.(next);
        return next;
      });
    },
    [onConnectionsChange]
  );

  const hasConnection = useCallback(
    (
      srcId: string,
      srcOut: string,
      tgtId: string,
      tgtIn: string
    ) =>
      connections.some(
        (c) =>
          c.sourceNodeId === srcId &&
          c.sourceOutput === srcOut &&
          c.targetNodeId === tgtId &&
          c.targetInput === tgtIn
      ),
    [connections]
  );

  return {
    connections,
    setConns,
    update,
    hasConnection,
  };
}
