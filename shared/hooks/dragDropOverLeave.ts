/**
 * Drag over and leave handler logic
 */

import React, { useCallback } from 'react'

interface OverLeaveSetters {
  setDropTarget: (v: string | null) => void
  setDropPosition: (
    v: 'before' | 'after' | 'inside' | null
  ) => void
}

/** Create drag over and leave handlers */
export function useDragOverLeave(
  setters: OverLeaveSetters
) {
  const { setDropTarget, setDropPosition } =
    setters

  const handleDragOver = useCallback(
    (
      targetId: string,
      e: React.DragEvent
    ) => {
      e.preventDefault()
      e.stopPropagation()
      const rect =
        e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      const h = rect.height
      let pos: 'before' | 'after' | 'inside' =
        'inside'
      if (y < h * 0.25) pos = 'before'
      else if (y > h * 0.75) pos = 'after'
      setDropTarget(targetId)
      setDropPosition(pos)
    },
    [setDropTarget, setDropPosition]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      const rel =
        e.relatedTarget as HTMLElement
      if (
        !rel ||
        !e.currentTarget.contains(rel)
      ) {
        setDropTarget(null)
        setDropPosition(null)
      }
    },
    [setDropTarget, setDropPosition]
  )

  return { handleDragOver, handleDragLeave }
}
