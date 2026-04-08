/**
 * Node drag interaction callbacks
 */

import { useState, useCallback } from 'react';
import type { Position } from './workflowNodesTypes';

/** Hook for node drag state */
export function useNodeDrag(
  moveNode: (id: string, pos: Position) => void
) {
  const [draggingNodeId, setDraggingNodeId] =
    useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0,
  });

  const startDrag = useCallback(
    (id: string, ox: number, oy: number) => {
      setDraggingNodeId(id);
      setDragOffset({ x: ox, y: oy });
    },
    []
  );

  const updateDrag = useCallback(
    (pos: Position) => {
      if (draggingNodeId) {
        moveNode(draggingNodeId, {
          x: pos.x - dragOffset.x,
          y: pos.y - dragOffset.y,
        });
      }
    },
    [draggingNodeId, dragOffset, moveNode]
  );

  const endDrag = useCallback(
    () => setDraggingNodeId(null),
    []
  );

  return {
    draggingNodeId,
    dragOffset,
    startDrag,
    updateDrag,
    endDrag,
  };
}
