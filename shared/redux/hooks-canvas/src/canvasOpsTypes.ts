/**
 * Canvas Item Operations Types
 * Types for the useCanvasItemsOperations hook
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '@shared/service-adapters'

/** @brief Return type for canvas ops */
export interface UseCanvasItemsOperationsReturn {
  createCanvasItem: (
    data: CreateCanvasItemRequest
  ) => Promise<ProjectCanvasItem | null>
  updateCanvasItem: (
    itemId: string,
    data: UpdateCanvasItemRequest
  ) => Promise<ProjectCanvasItem | null>
  bulkUpdateItems: (
    updates: Array<
      Partial<ProjectCanvasItem> & { id: string }
    >
  ) => Promise<void>
}
