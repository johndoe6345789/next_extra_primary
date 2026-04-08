/**
 * useCanvasItems Hook (Tier 2)
 * Manages canvas items loading and deletion
 * with service adapter injection.
 */

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useServices } from '@shared/service-adapters'
import {
  selectProjectIsLoading,
  selectProjectError,
  selectCurrentProjectId,
  setProjectLoading,
  setProjectError,
  setCanvasItems,
  removeCanvasItem,
  selectCanvasItems,
  selectIsResizing,
  setResizing,
} from '@shared/redux-slices'
import type { AppDispatch, RootState } from '@shared/redux-slices'
import type { UseCanvasItemsReturn } from './canvasItemsTypes'

export type { UseCanvasItemsReturn } from './canvasItemsTypes'

/** @brief Canvas items load/delete hook */
export function useCanvasItems(): UseCanvasItemsReturn {
  const dispatch = useDispatch<AppDispatch>()
  const { projectService } = useServices()
  const [isInit, setIsInit] = useState(false)

  const projectId = useSelector((s: RootState) => selectCurrentProjectId(s))
  const canvasItems = useSelector((s: RootState) => selectCanvasItems(s))
  const isLoading = useSelector((s: RootState) => selectProjectIsLoading(s))
  const error = useSelector((s: RootState) => selectProjectError(s))
  const isResizing = useSelector((s: RootState) => selectIsResizing(s))

  const loadCanvasItems = useCallback(async () => {
    if (!projectId) return
    dispatch(setProjectLoading(true))
    try {
      const items = await projectService.getCanvasItems(projectId)
      dispatch(setCanvasItems(items))
      dispatch(setProjectError(null))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load canvas items'
      dispatch(setProjectError(msg))
      throw err
    } finally {
      dispatch(setProjectLoading(false))
    }
  }, [projectId, dispatch, projectService])

  useEffect(() => {
    if (projectId && !isInit) {
      loadCanvasItems()
      setIsInit(true)
    }
  }, [projectId, isInit])

  const deleteCanvasItem = useCallback(async (itemId: string) => {
    if (!projectId) return
    dispatch(setProjectLoading(true))
    try {
      await projectService.deleteCanvasItem(projectId, itemId)
      dispatch(removeCanvasItem(itemId))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete canvas item'
      dispatch(setProjectError(msg))
      throw err
    } finally {
      dispatch(setProjectLoading(false))
    }
  }, [projectId, dispatch, projectService])

  const setResizingState = useCallback((v: boolean) => {
    dispatch(setResizing(v))
  }, [dispatch])

  return {
    canvasItems, isLoading, error, isResizing,
    loadCanvasItems, deleteCanvasItem,
    setResizingState,
  }
}

export default useCanvasItems
