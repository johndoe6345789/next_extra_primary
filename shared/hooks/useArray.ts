/**
 * useArray hook
 * Array operations with React state
 */

import { useState, useCallback } from 'react'
import type {
  UseArrayReturn,
} from './arrayTypes'
import { useArrayMutations } from './arrayMutations'

export type { UseArrayReturn } from './arrayTypes'

/**
 * Hook for managing array state
 * @param initialItems - Initial array items
 */
export function useArray<T>(
  initialItems?: T[]
): UseArrayReturn<T> {
  const [items, setItems] = useState<T[]>(
    initialItems ?? []
  )

  const push = useCallback((item: T) => {
    setItems((p) => [...p, item])
  }, [])

  const pop = useCallback(() => {
    if (items.length === 0) return undefined
    const popped = items[items.length - 1]
    setItems((p) => p.slice(0, -1))
    return popped
  }, [items])

  const shift = useCallback(() => {
    if (items.length === 0) return undefined
    const shifted = items[0]
    setItems((p) => p.slice(1))
    return shifted
  }, [items])

  const unshift = useCallback((item: T) => {
    setItems((p) => [item, ...p])
  }, [])

  const { insert, remove, swap, clear, filter } =
    useArrayMutations<T>(setItems)

  const map = useCallback(
    <R,>(cb: (item: T) => R): R[] =>
      items.map(cb),
    [items]
  )

  const get = useCallback(
    (index: number) => items[index],
    [items]
  )

  return {
    items,
    push,
    pop,
    shift,
    unshift,
    insert,
    remove,
    swap,
    clear,
    filter,
    map,
    length: items.length,
    get,
  }
}
