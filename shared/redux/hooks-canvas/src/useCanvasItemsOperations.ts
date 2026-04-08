/**
 * useCanvasItemsOperations Hook (Tier 2)
 * Manages canvas item creation and updates
 * with service adapter injection.
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServices } from '@shared/service-adapters'
import {
  setProjectLoading,
  setProjectError,
  selectCurrentProjectId,
  addCanvasItem,
  updateCanvasItem,
  bulkUpdateCanvasItems,
} from '@shared/redux-slices'
import type { AppDispatch, RootState } from '@shared/redux-slices'
import type { CreateCanvasItemRequest, UpdateCanvasItemRequest, ProjectCanvasItem } from '@shared/service-adapters'
import type { UseCanvasItemsOperationsReturn } from './canvasOpsTypes'

export type { UseCanvasItemsOperationsReturn } from './canvasOpsTypes'

/** @brief Canvas item creation/update hook */
export function useCanvasItemsOperations(): UseCanvasItemsOperationsReturn {
  const dispatch = useDispatch<AppDispatch>()
  const { projectService } = useServices()
  const projectId = useSelector((s: RootState) => selectCurrentProjectId(s))

  const createItem = useCallback(async (data: CreateCanvasItemRequest) => {
    if (!projectId) return null
    dispatch(setProjectLoading(true))
    try {
      const item = await projectService.createCanvasItem(projectId, data)
      dispatch(addCanvasItem(item))
      return item
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create canvas item'
      dispatch(setProjectError(msg))
      throw err
    } finally {
      dispatch(setProjectLoading(false))
    }
  }, [projectId, dispatch, projectService])

  const updateItem = useCallback(async (itemId: string, data: UpdateCanvasItemRequest) => {
    if (!projectId) return null
    try {
      const updated = await projectService.updateCanvasItem(projectId, itemId, data)
      dispatch(updateCanvasItem({ ...updated, id: itemId }))
      return updated
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update canvas item'
      dispatch(setProjectError(msg))
      throw err
    }
  }, [projectId, dispatch, projectService])

  const bulkUpdate = useCallback(async (
    updates: Array<Partial<ProjectCanvasItem> & { id: string }>
  ) => {
    if (!projectId) return
    try {
      const items = await projectService.bulkUpdateCanvasItems(projectId, updates)
      dispatch(bulkUpdateCanvasItems(items))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to bulk update canvas items'
      dispatch(setProjectError(msg))
      throw err
    }
  }, [projectId, dispatch, projectService])

  return {
    createCanvasItem: createItem,
    updateCanvasItem: updateItem,
    bulkUpdateItems: bulkUpdate,
  }
}

export default useCanvasItemsOperations
