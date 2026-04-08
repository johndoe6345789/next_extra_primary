/**
 * Connection CRUD callbacks
 */

import { useCallback } from 'react';
import type { Connection } from './workflowConnectionsTypes';

type Updater = (
  fn: (p: Connection[]) => Connection[]
) => void;

/** Create connection CRUD callbacks */
export function useConnectionCrud(
  update: Updater,
  hasConnection: (
    srcId: string,
    srcOut: string,
    tgtId: string,
    tgtIn: string
  ) => boolean,
  setConns: React.Dispatch<
    React.SetStateAction<Connection[]>
  >,
  onConnectionsChange?: (
    c: Connection[]
  ) => void
) {
  const addConnection = useCallback(
    (c: Connection) => {
      if (c.sourceNodeId === c.targetNodeId)
        return false;
      if (
        hasConnection(
          c.sourceNodeId,
          c.sourceOutput,
          c.targetNodeId,
          c.targetInput
        )
      )
        return false;
      update((prev) => [...prev, c]);
      return true;
    },
    [hasConnection, update]
  );

  const removeConnection = useCallback(
    (id: string) =>
      update((p) =>
        p.filter((c) => c.id !== id)
      ),
    [update]
  );

  const removeConnectionByEndpoints =
    useCallback(
      (srcId: string, tgtId: string) =>
        update((p) =>
          p.filter(
            (c) =>
              !(
                c.sourceNodeId === srcId &&
                c.targetNodeId === tgtId
              )
          )
        ),
      [update]
    );

  const setConnections = useCallback(
    (newConns: Connection[]) => {
      setConns(newConns);
      onConnectionsChange?.(newConns);
    },
    [setConns, onConnectionsChange]
  );

  return {
    addConnection,
    removeConnection,
    removeConnectionByEndpoints,
    setConnections,
  };
}
