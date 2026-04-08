/**
 * Center-on-node and fit-to-screen callbacks
 */

import { useCallback } from 'react';
import type {
  UseEditorZoomReturn,
} from './useEditorZoom';
import type {
  UseEditorPanReturn,
} from './useEditorPan';

interface CanvasSize {
  width: number;
  height: number;
}

/** Create fitToScreen and centerOnNode */
export function useCenterCallbacks(
  canvasSize: CanvasSize,
  zoomHook: UseEditorZoomReturn,
  panHook: UseEditorPanReturn
) {
  const fitToScreen = useCallback(() => {
    zoomHook.resetZoom();
    panHook.resetPan();
  }, [zoomHook, panHook]);

  const centerOnNode = useCallback(
    (nodeId: string, nodes: unknown[]) => {
      const node = (nodes as Array<{
        id: string;
        position: { x: number; y: number };
        width: number;
        height: number;
      }>).find((n) => n.id === nodeId);
      if (node) {
        panHook.setPan(
          canvasSize.width / 2 -
            (node.position.x +
              node.width / 2),
          canvasSize.height / 2 -
            (node.position.y +
              node.height / 2)
        );
      }
    },
    [canvasSize, panHook]
  );

  return { fitToScreen, centerOnNode };
}
