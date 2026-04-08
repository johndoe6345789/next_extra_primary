/**
 * useWorkflowConnections Hook
 * Manages connections between workflow nodes
 */

import type {
  UseWorkflowConnectionsReturn,
  UseWorkflowConnectionsOptions,
} from './workflowConnectionsTypes';
import {
  useConnectionDrawing,
} from './workflowConnectionsDrawing';
import {
  useConnectionQueries,
} from './workflowConnectionsQuery';
import {
  useConnectionCrud,
} from './workflowConnectionsCrud';
import {
  defaultGenId,
  useConnectionState,
} from './workflowConnectionsInit';

export type {
  Position,
  Connection,
  DrawingConnection,
  UseWorkflowConnectionsReturn,
  UseWorkflowConnectionsOptions,
} from './workflowConnectionsTypes';

/** Hook for workflow connection management */
export function useWorkflowConnections(
  opts: UseWorkflowConnectionsOptions = {}
): UseWorkflowConnectionsReturn {
  const {
    initialConnections = [],
    onConnectionsChange,
    generateConnectionId = defaultGenId,
  } = opts;

  const {
    connections, setConns,
    update, hasConnection,
  } = useConnectionState(
    initialConnections,
    onConnectionsChange
  );

  const crud = useConnectionCrud(
    update,
    hasConnection,
    setConns,
    onConnectionsChange
  );
  const drawing = useConnectionDrawing(
    crud.addConnection,
    generateConnectionId
  );
  const queries = useConnectionQueries(
    connections,
    update
  );

  return {
    connections,
    ...drawing,
    ...crud,
    ...queries,
    hasConnection,
  };
}
