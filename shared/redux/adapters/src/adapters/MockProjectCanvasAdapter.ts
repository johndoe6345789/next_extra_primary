/**
 * MockProjectCanvasAdapter
 * In-memory canvas item operations.
 */

import { ProjectCanvasItem, CreateCanvasItemRequest, UpdateCanvasItemRequest } from '../types'

/** @brief In-memory canvas item CRUD */
export class MockProjectCanvasAdapter {
  private canvasItems: Map<string, ProjectCanvasItem> = new Map()

  /** @brief Get all canvas items for project */
  async getCanvasItems(projectId: string): Promise<ProjectCanvasItem[]> {
    return Array.from(this.canvasItems.values())
      .filter((i) => i.projectId === projectId).map((i) => ({ ...i }))
  }

  /** @brief Create a canvas item */
  async createCanvasItem(projectId: string, data: CreateCanvasItemRequest): Promise<ProjectCanvasItem> {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const existing = Array.from(this.canvasItems.values()).filter((i) => i.projectId === projectId)
    const maxZ = existing.length > 0 ? Math.max(...existing.map((i) => i.zIndex)) : 0
    const item: ProjectCanvasItem = {
      id, projectId, workflowId: data.workflowId, position: data.position,
      size: data.size || { width: 200, height: 150 },
      zIndex: maxZ + 1, createdAt: Date.now(), updatedAt: Date.now(),
    }
    this.canvasItems.set(item.id, item)
    return { ...item }
  }

  /** @brief Update a canvas item */
  async updateCanvasItem(projectId: string, itemId: string, data: UpdateCanvasItemRequest): Promise<ProjectCanvasItem> {
    const item = this.canvasItems.get(itemId)
    if (!item || item.projectId !== projectId) throw new Error('Canvas item not found')
    const updated = { ...item, ...data, updatedAt: Date.now() }
    this.canvasItems.set(itemId, updated)
    return { ...updated }
  }

  /** @brief Delete a canvas item */
  async deleteCanvasItem(projectId: string, itemId: string): Promise<void> {
    const item = this.canvasItems.get(itemId)
    if (!item || item.projectId !== projectId) throw new Error('Canvas item not found')
    this.canvasItems.delete(itemId)
  }

  /** @brief Bulk update canvas items */
  async bulkUpdateCanvasItems(
    projectId: string, updates: Array<Partial<ProjectCanvasItem> & { id: string }>
  ): Promise<ProjectCanvasItem[]> {
    const results: ProjectCanvasItem[] = []
    for (const u of updates) {
      const item = this.canvasItems.get(u.id)
      if (item && item.projectId === projectId) {
        const updated = { ...item, ...u, updatedAt: Date.now() }
        this.canvasItems.set(u.id, updated)
        results.push({ ...updated })
      }
    }
    return results
  }
}
