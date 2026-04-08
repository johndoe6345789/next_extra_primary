/**
 * Type definitions for useUndo hook
 */

/** Return type of useUndo */
export interface UseUndoReturn<T> {
  /** Current value */
  value: T
  /** Set new value (stores for undo) */
  setValue: (
    value: T | ((prev: T) => T)
  ) => void
  /** Undo to previous value */
  undo: () => void
  /** Redo to next value */
  redo: () => void
  /** Reset to initial value */
  reset: (value?: T) => void
  /** Whether undo is available */
  canUndo: boolean
  /** Whether redo is available */
  canRedo: boolean
}
