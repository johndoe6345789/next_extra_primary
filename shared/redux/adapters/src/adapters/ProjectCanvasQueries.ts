/**
 * Project canvas item fetch operations.
 * Mixed into DefaultProjectServiceAdapter
 * via class property assignment.
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '../types'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

/** @brief Fetch canvas items for a project */
export async function getCanvasItems(
  this: { apiBaseUrl: string },
  projectId: string
): Promise<ProjectCanvasItem[]> {
  const url =
    `${this.apiBaseUrl}/projects/${projectId}/canvas`
  const r = await fetch(url)
  if (!r.ok) {
    throw new Error('Failed to fetch canvas items')
  }
  const d = await r.json()
  return d.items || []
}

/** @brief Create a canvas item */
export async function createCanvasItem(
  this: { apiBaseUrl: string },
  projectId: string,
  data: CreateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  const url =
    `${this.apiBaseUrl}/projects/${projectId}/canvas/items`
  const r = await fetch(url, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
  if (!r.ok) {
    throw new Error('Failed to create canvas item')
  }
  return r.json()
}

/** @brief Update a canvas item */
export async function updateCanvasItem(
  this: { apiBaseUrl: string },
  projectId: string,
  itemId: string,
  data: UpdateCanvasItemRequest
): Promise<ProjectCanvasItem> {
  const url =
    `${this.apiBaseUrl}/projects/${projectId}/canvas/items/${itemId}`
  const r = await fetch(url, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
  if (!r.ok) {
    throw new Error('Failed to update canvas item')
  }
  return r.json()
}
