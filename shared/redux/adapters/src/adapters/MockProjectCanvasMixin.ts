/**
 * MockProjectServiceAdapter canvas mixins.
 * Delegates to mockCanvasOperations functions.
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '../types'
import {
  getCanvasItems as getItems,
  createCanvasItem as createItem,
  updateCanvasItem as updateItem,
} from './mockCanvasOperations'
import {
  deleteCanvasItem as deleteItem,
  bulkUpdateCanvasItems as bulkUpdate,
} from './mockCanvasBulkOps'

type CanvasMap = Map<string, ProjectCanvasItem>

/** @brief Get canvas items for a project */
export async function getCanvasItems(
  this: { canvasItems: CanvasMap },
  projectId: string
): Promise<ProjectCanvasItem[]> {
  return getItems(
    this.canvasItems, projectId
  )
}

/** @brief Create a canvas item in the store */
export async function createCanvasItem(
  this: { canvasItems: CanvasMap },
  projectId: string,
  data: CreateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  return createItem(
    this.canvasItems, projectId, data
  )
}

/** @brief Update a canvas item */
export async function updateCanvasItem(
  this: { canvasItems: CanvasMap },
  projectId: string,
  itemId: string,
  data: UpdateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  return updateItem(
    this.canvasItems, projectId, itemId, data
  )
}

/** @brief Delete a canvas item */
export async function deleteCanvasItem(
  this: { canvasItems: CanvasMap },
  projectId: string,
  itemId: string
): Promise<void> {
  deleteItem(
    this.canvasItems, projectId, itemId
  )
}

/** @brief Bulk update canvas items */
export async function bulkUpdateCanvasItems(
  this: { canvasItems: CanvasMap },
  projectId: string,
  updates: Array<
    Partial<ProjectCanvasItem> & { id: string }
  >
): Promise<ProjectCanvasItem[]> {
  return bulkUpdate(
    this.canvasItems, projectId, updates
  )
}
