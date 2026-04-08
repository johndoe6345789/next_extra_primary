/**
 * useEditorNavigation
 * Fit-to-screen and center-on-node actions.
 */

import { useCallback } from 'react'
import type {
  UseEditorZoomReturn,
} from './useEditorZoom'
import type {
  UseEditorPanReturn,
} from './useEditorPan'

/** @brief Canvas dimensions */
interface CanvasSize {
  width: number
  height: number
}

/** @brief Return type for navigation hook */
export interface UseEditorNavigationReturn {
  fitToScreen: () => void
  centerOnNode: (
    nodeId: string,
    nodes: { id: string; position: {
      x: number; y: number
    }; width: number; height: number }[]
  ) => void
}

/**
 * @brief Navigation actions for the editor
 * @param zoomHook - Zoom hook instance
 * @param panHook - Pan hook instance
 * @param canvasSize - Current canvas dims
 * @returns Navigation action callbacks
 */
export function useEditorNavigation(
  zoomHook: UseEditorZoomReturn,
  panHook: UseEditorPanReturn,
  canvasSize: CanvasSize
): UseEditorNavigationReturn {
  /** @brief Fit editor to screen */
  const fitToScreen = useCallback(() => {
    zoomHook.resetZoom()
    panHook.resetPan()
  }, [zoomHook, panHook])

  /** @brief Center view on a node */
  const centerOnNode = useCallback(
    (nodeId: string, nodes: any[]) => {
      const node = nodes.find(
        (n) => n.id === nodeId
      )
      if (node) {
        panHook.setPan(
          canvasSize.width / 2 -
            (node.position.x +
              node.width / 2),
          canvasSize.height / 2 -
            (node.position.y +
              node.height / 2)
        )
      }
    },
    [canvasSize, panHook]
  )

  return { fitToScreen, centerOnNode }
}
