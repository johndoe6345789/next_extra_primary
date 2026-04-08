/**
 * useUndo Hook
 * Simplified undo/redo for any value
 */

import { useState, useCallback } from 'react'
import type {
  UseUndoReturn,
} from './undoTypes'

export type { UseUndoReturn } from './undoTypes'

/**
 * Hook for undo/redo operations
 * @param initialValue - Initial value
 */
export function useUndo<T>(
  initialValue: T
): UseUndoReturn<T> {
  const [past, setPast] = useState<T[]>([])
  const [present, setPresent] =
    useState<T>(initialValue)
  const [future, setFuture] = useState<T[]>([])

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const v =
        newValue instanceof Function
          ? newValue(present)
          : newValue
      setPast((p) => [...p, present])
      setPresent(v)
      setFuture([])
    },
    [present]
  )

  const undo = useCallback(() => {
    if (past.length === 0) return
    setPast((p) => {
      const next = [...p]
      const prev = next.pop()
      if (prev !== undefined) {
        setFuture((f) => [present, ...f])
        setPresent(prev)
      }
      return next
    })
  }, [present])

  const redo = useCallback(() => {
    if (future.length === 0) return
    const next = future[0]
    setPast((p) => [...p, present])
    setFuture((f) => f.slice(1))
    setPresent(next)
  }, [present, future])

  const reset = useCallback(
    (value: T = initialValue) => {
      setPast([])
      setPresent(value)
      setFuture([])
    },
    [initialValue]
  )

  return {
    value: present,
    setValue,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}
