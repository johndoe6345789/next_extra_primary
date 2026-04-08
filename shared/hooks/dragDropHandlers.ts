/**
 * Drag and drop event handler logic
 */

import React, { useCallback } from 'react'
import type { DragItem } from './dragDropTypes'
export { useDragOverLeave } from './dragDropOverLeave'

interface DragDropSetters {
  setDraggedItem: (v: DragItem | null) => void
  setDropTarget: (v: string | null) => void
  setDropPosition: (
    v: 'before' | 'after' | 'inside' | null
  ) => void
  startPos: React.RefObject<{
    x: number; y: number
  } | null>
}

/** Create drag start and end handlers */
export function useDragStartEnd(
  setters: DragDropSetters
) {
  const {
    setDraggedItem, setDropTarget,
    setDropPosition, startPos,
  } = setters

  const handleDragStart = useCallback(
    (item: DragItem, e: React.DragEvent) => {
      setDraggedItem(item)
      startPos.current = {
        x: e.clientX, y: e.clientY,
      }
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData(
        'text/plain', JSON.stringify(item)
      )
    },
    [setDraggedItem, startPos]
  )

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDropTarget(null)
    setDropPosition(null)
    startPos.current = null
  }, [setDraggedItem, setDropTarget,
    setDropPosition, startPos])

  return { handleDragStart, handleDragEnd }
}
