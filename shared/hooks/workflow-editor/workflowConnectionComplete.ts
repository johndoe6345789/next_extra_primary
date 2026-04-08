/**
 * Connection completion callback
 */

import { useCallback } from 'react';
import type {
  Connection,
  DrawingConnection,
} from './workflowConnectionsTypes';

/**
 * Build completeConnection callback
 * @param drawingConnection - Current drawing
 * @param generateId - ID generator
 * @param addConnection - Add callback
 * @param cancelDrawing - Cancel callback
 */
export function useCompleteConnection(
  drawingConnection: DrawingConnection | null,
  generateId: () => string,
  addConnection: (c: Connection) => boolean,
  cancelDrawing: () => void
) {
  return useCallback(
    (tgtId: string, tgtInput: string) => {
      if (!drawingConnection) return false;
      if (
        drawingConnection.sourceNodeId === tgtId
      ) {
        cancelDrawing();
        return false;
      }
      const newConn: Connection = {
        id: generateId(),
        sourceNodeId:
          drawingConnection.sourceNodeId,
        sourceOutput:
          drawingConnection.sourceOutput,
        targetNodeId: tgtId,
        targetInput: tgtInput,
      };
      const ok = addConnection(newConn);
      cancelDrawing();
      return ok;
    },
    [
      drawingConnection,
      generateId,
      addConnection,
      cancelDrawing,
    ]
  );
}
