/**
 * Selection operations for useListOperations
 */

import { useState, useCallback } from 'react'

/**
 * Hook managing selection state for list items
 * @param items - Current list items
 * @param getId - Function to extract item ID
 * @returns Selection state and operations
 */
export function useListSelection<T>(
  items: T[],
  getId: (item: T) => string | number
) {
  const [selectedIds, setSelectedIds] =
    useState<Set<string | number>>(new Set())

  /** Toggle selection of a single item */
  const toggleSelection = useCallback(
    (id: string | number) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    []
  )

  /** Select all items in the list */
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getId)))
  }, [items, getId])

  /** Clear all selections */
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  /** Remove IDs from selection set */
  const deselectIds = useCallback(
    (ids: (string | number)[]) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    },
    []
  )

  return {
    selectedIds,
    setSelectedIds,
    selectedCount: selectedIds.size,
    selectedArray: Array.from(selectedIds),
    toggleSelection,
    selectAll,
    clearSelection,
    deselectIds,
  }
}
