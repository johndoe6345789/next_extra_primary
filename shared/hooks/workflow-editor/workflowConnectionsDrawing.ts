/**
 * Connection drawing callbacks
 */

import { useState, useCallback } from 'react';
import type {
  Position,
  Connection,
  DrawingConnection,
} from './workflowConnectionsTypes';
import {
  useCompleteConnection,
} from './workflowConnectionComplete';

/** Hook for managing drawing state */
export function useConnectionDrawing(
  addConnection: (c: Connection) => boolean,
  generateId: () => string
) {
  const [drawingConnection, setDrawing] =
    useState<DrawingConnection | null>(null);

  const startDrawing = useCallback(
    (
      srcId: string,
      srcOut: string,
      pos: Position
    ) => {
      setDrawing({
        sourceNodeId: srcId,
        sourceOutput: srcOut,
        startPosition: pos,
        currentPosition: pos,
      });
    },
    []
  );

  const updateDrawing = useCallback(
    (pos: Position) => {
      setDrawing((prev) =>
        prev
          ? { ...prev, currentPosition: pos }
          : null
      );
    },
    []
  );

  const cancelDrawing = useCallback(() => {
    setDrawing(null);
  }, []);

  const completeConnection =
    useCompleteConnection(
      drawingConnection,
      generateId,
      addConnection,
      cancelDrawing
    );

  return {
    drawingConnection,
    isDrawing: drawingConnection !== null,
    startDrawing,
    updateDrawing,
    endDrawing: cancelDrawing,
    cancelDrawing,
    completeConnection,
  };
}
