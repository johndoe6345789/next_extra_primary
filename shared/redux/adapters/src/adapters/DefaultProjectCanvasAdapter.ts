/**
 * DefaultProjectCanvasAdapter
 * HTTP canvas item CRUD operations.
 */

import type {
  ProjectCanvasItem,
  CreateCanvasItemRequest,
  UpdateCanvasItemRequest,
} from '../types'
import { canvasFetchOps } from './defaultCanvasFetchOps'

/** @brief HTTP adapter for canvas CRUD */
export class DefaultProjectCanvasAdapter {
  constructor(
    private apiBaseUrl: string = '/api'
  ) {}

  /** @brief Fetch canvas items */
  async getCanvasItems(
    projectId: string
  ): Promise<ProjectCanvasItem[]> {
    return canvasFetchOps.getItems(
      this.apiBaseUrl, projectId
    )
  }

  /** @brief Create a canvas item */
  async createCanvasItem(
    projectId: string,
    data: CreateCanvasItemRequest
  ): Promise<ProjectCanvasItem> {
    return canvasFetchOps.createItem(
      this.apiBaseUrl, projectId, data
    )
  }

  /** @brief Update a canvas item */
  async updateCanvasItem(
    projectId: string,
    itemId: string,
    data: UpdateCanvasItemRequest
  ): Promise<ProjectCanvasItem> {
    return canvasFetchOps.updateItem(
      this.apiBaseUrl, projectId, itemId, data
    )
  }

  /** @brief Delete a canvas item */
  async deleteCanvasItem(
    projectId: string,
    itemId: string
  ): Promise<void> {
    return canvasFetchOps.deleteItem(
      this.apiBaseUrl, projectId, itemId
    )
  }

  /** @brief Bulk update canvas items */
  async bulkUpdateCanvasItems(
    projectId: string,
    updates: Array<
      Partial<ProjectCanvasItem> & { id: string }
    >
  ): Promise<ProjectCanvasItem[]> {
    return canvasFetchOps.bulkUpdate(
      this.apiBaseUrl, projectId, updates
    )
  }
}
