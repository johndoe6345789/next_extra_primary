/**
 * useStateWithHistory Hook
 * State management with undo/redo history
 */

import { useState, useCallback } from 'react'
import type {
  UseStateWithHistoryOptions,
  UseStateWithHistoryReturn,
} from './stateWithHistoryTypes'
import { useHistoryOps } from './stateHistoryOps'

export type {
  UseStateWithHistoryOptions,
  UseStateWithHistoryReturn,
} from './stateWithHistoryTypes'

/**
 * Hook for state with undo/redo capability
 * @param initialValue - Initial state value
 * @param options - Configuration options
 */
export function useStateWithHistory<T>(
  initialValue: T,
  options: UseStateWithHistoryOptions = {}
): UseStateWithHistoryReturn<T> {
  const { maxHistory = 100 } = options

  const [history, setHistory] = useState<T[]>([
    initialValue,
  ])
  const [currentIndex, setCurrentIndex] =
    useState<number>(0)

  const value = history[currentIndex]

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setHistory((prev) => {
        const v =
          newValue instanceof Function
            ? newValue(prev[currentIndex])
            : newValue
        const next = prev.slice(
          0,
          currentIndex + 1
        )
        next.push(v)
        if (next.length > maxHistory) {
          next.shift()
          setCurrentIndex((p) =>
            Math.max(0, p - 1)
          )
        } else {
          setCurrentIndex(next.length - 1)
        }
        return next
      })
    },
    [currentIndex, maxHistory]
  )

  const { undo, redo } = useHistoryOps(
    currentIndex, setHistory, setCurrentIndex
  )

  const canUndo = currentIndex > 0
  const canRedo =
    currentIndex < history.length - 1

  return {
    value, setValue,
    undo, redo,
    canUndo, canRedo, history,
  }
}
