/**
 * Project canvas bulk and delete operations.
 * Mixed into DefaultProjectServiceAdapter
 * via class property assignment.
 */

import type { ProjectCanvasItem } from '../types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

/** @brief Delete a canvas item */
export async function deleteCanvasItem(
  this: { apiBaseUrl: string },
  projectId: string,
  itemId: string
): Promise<void> {
  const url =
    `${this.apiBaseUrl}/projects/${projectId}/canvas/items/${itemId}`
  const r = await fetch(url, {
    method: 'DELETE',
  })
  if (!r.ok) {
    throw new Error('Failed to delete canvas item')
  }
}

/** @brief Bulk update canvas items */
export async function bulkUpdateCanvasItems(
  this: { apiBaseUrl: string },
  projectId: string,
  updates: Array<
    Partial<ProjectCanvasItem> & { id: string }
  >
): Promise<ProjectCanvasItem[]> {
  const url =
    `${this.apiBaseUrl}/projects/${projectId}/canvas/bulk-update`
  const r = await fetch(url, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ items: updates }),
  })
  if (!r.ok) {
    throw new Error('Failed to bulk update')
  }
  const d = await r.json()
  return d.items || []
}
