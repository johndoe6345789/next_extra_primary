/**
 * Mock Canvas Bulk Operations
 *
 * Delete and bulk update for in-memory
 * canvas items.
 */

import type { ProjectCanvasItem } from '../types'

type ItemMap = Map<string, ProjectCanvasItem>

/** @brief Delete a canvas item */
export function deleteCanvasItem(
  items: ItemMap,
  projectId: string,
  itemId: string
): void {
  const item = items.get(itemId)
  if (!item || item.projectId !== projectId) {
    throw new Error('Canvas item not found')
  }
  items.delete(itemId)
}

/** @brief Bulk update canvas items */
export function bulkUpdateCanvasItems(
  items: ItemMap,
  projectId: string,
  updates: Array<
    Partial<ProjectCanvasItem> & { id: string }
  >
): ProjectCanvasItem[] {
  const results: ProjectCanvasItem[] = []
  for (const u of updates) {
    const item = items.get(u.id)
    if (item && item.projectId === projectId) {
      const updated = {
        ...item, ...u, updatedAt: Date.now(),
      }
      items.set(u.id, updated)
      results.push({ ...updated })
    }
  }
  return results
}
