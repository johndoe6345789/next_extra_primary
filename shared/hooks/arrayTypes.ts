/**
 * Type definitions for useArray hook
 */

/** Return type of useArray */
export interface UseArrayReturn<T> {
  /** Current items */
  items: T[]
  /** Append an item */
  push: (item: T) => void
  /** Remove and return last item */
  pop: () => T | undefined
  /** Remove and return first item */
  shift: () => T | undefined
  /** Prepend an item */
  unshift: (item: T) => void
  /** Insert at index */
  insert: (index: number, item: T) => void
  /** Remove at index */
  remove: (index: number) => void
  /** Swap two items */
  swap: (
    indexA: number,
    indexB: number
  ) => void
  /** Clear all items */
  clear: () => void
  /** Filter items in place */
  filter: (
    predicate: (item: T) => boolean
  ) => void
  /** Map items (returns new array) */
  map: <R>(
    callback: (item: T) => R
  ) => R[]
  /** Number of items */
  length: number
  /** Get item at index */
  get: (index: number) => T | undefined
}
