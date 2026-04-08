/**
 * State-with-history undo/redo operations
 */

import { useCallback } from 'react'

type SetHistory<T> = React.Dispatch<
  React.SetStateAction<T[]>
>
type SetIndex = React.Dispatch<
  React.SetStateAction<number>
>

/**
 * Build undo and redo callbacks
 * @param currentIndex - Current position
 * @param setHistory - History state setter
 * @param setCurrentIndex - Index setter
 */
export function useHistoryOps<T>(
  currentIndex: number,
  setHistory: SetHistory<T>,
  setCurrentIndex: SetIndex
) {
  const undo = useCallback(() => {
    setCurrentIndex((p) => Math.max(0, p - 1))
  }, [])

  const redo = useCallback(() => {
    setHistory((prev) => {
      const next = Math.min(
        currentIndex + 1,
        prev.length - 1
      )
      setCurrentIndex(next)
      return prev
    })
  }, [currentIndex])

  return { undo, redo }
}
