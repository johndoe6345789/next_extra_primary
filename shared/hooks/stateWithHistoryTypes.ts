/**
 * Type definitions for useStateWithHistory
 */

/** Options for useStateWithHistory */
export interface UseStateWithHistoryOptions {
  /** Maximum history size (default: 100) */
  maxHistory?: number
}

/** Return type of useStateWithHistory */
export interface UseStateWithHistoryReturn<T> {
  /** Current value */
  value: T
  /** Set new value and add to history */
  setValue: (
    value: T | ((prev: T) => T)
  ) => void
  /** Undo to previous state */
  undo: () => void
  /** Redo to next state */
  redo: () => void
  /** Whether undo is available */
  canUndo: boolean
  /** Whether redo is available */
  canRedo: boolean
  /** Full history array */
  history: T[]
}
