/**
 * CRUD operations for useListOperations
 */

import { useCallback } from 'react'

/** Create list CRUD callbacks */
export function useListCrud<T>(
  setItems: (fn: T[] | ((prev: T[]) => T[])) => void,
  getId: (item: T) => string | number,
  deselectIds: (ids: (string | number)[]) => void
) {
  const addItem = useCallback(
    (item: T, position?: number) => {
      setItems((prev) => {
        if (position !== undefined && position >= 0 && position <= prev.length) {
          const next = [...prev]
          next.splice(position, 0, item)
          return next
        }
        return [...prev, item]
      })
    },
    [setItems]
  )

  const updateItem = useCallback(
    (id: string | number, updates: Partial<T> | ((item: T) => T)) => {
      setItems((prev) =>
        prev.map((item) => {
          if (getId(item) !== id) return item
          return typeof updates === 'function' ? updates(item) : { ...item, ...updates }
        })
      )
    },
    [getId, setItems]
  )

  const removeItem = useCallback(
    (id: string | number) => {
      setItems((prev) => prev.filter((item) => getId(item) !== id))
      deselectIds([id])
    },
    [getId, setItems, deselectIds]
  )

  const removeItems = useCallback(
    (ids: (string | number)[]) => {
      const idSet = new Set(ids)
      setItems((prev) => prev.filter((item) => !idSet.has(getId(item))))
      deselectIds(ids)
    },
    [getId, setItems, deselectIds]
  )

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      setItems((prev) => {
        if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
          return prev
        }
        const next = [...prev]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      })
    },
    [setItems]
  )

  return { addItem, updateItem, removeItem, removeItems, moveItem }
}
