/**
 * Mock Canvas Operations
 *
 * In-memory canvas item CRUD logic for
 * MockProjectServiceAdapter.
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '../types'

export type ItemMap = Map<string, ProjectCanvasItem>

/** @brief Get all canvas items for project */
export function getCanvasItems(
  items: ItemMap, projectId: string
): ProjectCanvasItem[] {
  return Array.from(items.values())
    .filter((i) => i.projectId === projectId)
    .map((i) => ({ ...i }))
}

/** @brief Create a canvas item */
export function createCanvasItem(
  items: ItemMap,
  projectId: string,
  data: CreateCanvasItemRequest
): ProjectCanvasItem {
  const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const existing = Array.from(items.values())
    .filter((i) => i.projectId === projectId)
  const maxZ = existing.length > 0
    ? Math.max(...existing.map((i) => i.zIndex))
    : 0
  const item: ProjectCanvasItem = {
    id,
    projectId,
    workflowId: data.workflowId,
    position: data.position,
    size: data.size || { width: 200, height: 150 },
    zIndex: maxZ + 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  items.set(item.id, item)
  return { ...item }
}

/** @brief Update a canvas item */
export function updateCanvasItem(
  items: ItemMap,
  projectId: string,
  itemId: string,
  data: UpdateCanvasItemRequest
): ProjectCanvasItem {
  const item = items.get(itemId)
  if (!item || item.projectId !== projectId) {
    throw new Error('Canvas item not found')
  }
  const updated = {
    ...item, ...data, updatedAt: Date.now(),
  }
  items.set(itemId, updated)
  return { ...updated }
}

