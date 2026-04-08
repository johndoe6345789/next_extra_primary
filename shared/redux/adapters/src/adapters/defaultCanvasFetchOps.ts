/**
 * Canvas Fetch Operations
 * HTTP fetch helpers for canvas items.
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '../types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

/** @brief Canvas item fetch helpers */
export const canvasFetchOps = {
  async getItems(
    base: string, projectId: string
  ): Promise<ProjectCanvasItem[]> {
    const r = await fetch(`${base}/projects/${projectId}/canvas`)
    if (!r.ok) throw new Error('Failed to fetch canvas items')
    const d = await r.json()
    return d.items || []
  },

  async createItem(
    base: string, projectId: string, data: CreateCanvasItemRequest
  ): Promise<ProjectCanvasItem> {
    const r = await fetch(`${base}/projects/${projectId}/canvas/items`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('Failed to create canvas item')
    return r.json()
  },

  async updateItem(
    base: string, projectId: string, itemId: string, data: UpdateCanvasItemRequest
  ): Promise<ProjectCanvasItem> {
    const r = await fetch(`${base}/projects/${projectId}/canvas/items/${itemId}`, {
      method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error('Failed to update canvas item')
    return r.json()
  },

  async deleteItem(
    base: string, projectId: string, itemId: string
  ): Promise<void> {
    const r = await fetch(`${base}/projects/${projectId}/canvas/items/${itemId}`, {
      method: 'DELETE',
    })
    if (!r.ok) throw new Error('Failed to delete canvas item')
  },

  async bulkUpdate(
    base: string, projectId: string,
    updates: Array<Partial<ProjectCanvasItem> & { id: string }>
  ): Promise<ProjectCanvasItem[]> {
    const r = await fetch(`${base}/projects/${projectId}/canvas/bulk-update`, {
      method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ items: updates }),
    })
    if (!r.ok) throw new Error('Failed to bulk update canvas items')
    const d = await r.json()
    return d.items || []
  },
}
