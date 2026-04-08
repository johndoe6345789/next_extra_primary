/**
 * Canvas Items Types
 * Types for the useCanvasItems hook
 */

import type {
  ProjectCanvasItem,
} from '@shared/service-adapters'

/** @brief Return type for useCanvasItems */
export interface UseCanvasItemsReturn {
  canvasItems: ProjectCanvasItem[]
  isLoading: boolean
  error: string | null
  isResizing: boolean
  loadCanvasItems: () => Promise<void>
  deleteCanvasItem: (
    itemId: string
  ) => Promise<void>
  setResizingState: (
    isResizing: boolean
  ) => void
}
