/**
 * useDragDrop Hook
 * Drag and drop with position detection
 */

import {
  useState,
  useCallback,
  useRef,
} from 'react'
import type {
  DragItem,
  DropPosition,
  UseDragDropReturn,
} from './dragDropTypes'
import {
  useDragStartEnd,
  useDragOverLeave,
} from './dragDropHandlers'

export type {
  DragItem,
  DropPosition,
  UseDragDropReturn,
} from './dragDropTypes'

/**
 * Hook for drag and drop operations
 */
export function useDragDrop():
  UseDragDropReturn {
  const [draggedItem, setDraggedItem] =
    useState<DragItem | null>(null)
  const [dropTarget, setDropTarget] =
    useState<string | null>(null)
  const [dropPosition, setDropPosition] =
    useState<
      'before' | 'after' | 'inside' | null
    >(null)
  const startPos = useRef<{
    x: number
    y: number
  } | null>(null)

  const setters = {
    setDraggedItem,
    setDropTarget,
    setDropPosition,
    startPos,
  }

  const { handleDragStart, handleDragEnd } =
    useDragStartEnd(setters)
  const { handleDragOver, handleDragLeave } =
    useDragOverLeave(setters)

  const handleDrop = useCallback(
    (
      targetId: string,
      e: React.DragEvent,
      onDrop?: (
        item: DragItem,
        target: DropPosition
      ) => void
    ) => {
      e.preventDefault()
      e.stopPropagation()
      if (draggedItem && onDrop) {
        onDrop(draggedItem, {
          targetId,
          position: dropPosition || 'inside',
        })
      }
      handleDragEnd()
    },
    [draggedItem, dropPosition, handleDragEnd]
  )

  return {
    draggedItem,
    dropTarget,
    dropPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
