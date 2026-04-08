/**
 * List Selection Operations
 * Selection helpers for useListOperations
 */

import { useCallback } from 'react'

/**
 * Creates selection operations for a list
 * @param items - Current items array
 * @param getId - Function to get item ID
 * @param selectedIds - Current selection set
 * @param setSelectedIds - Selection setter
 * @param removeItems - Remove items function
 * @returns Selection operation callbacks
 */
export function useSelectionOps<T>(
  items: T[],
  getId: (item: T) => string | number,
  selectedIds: Set<string | number>,
  setSelectedIds: React.Dispatch<
    React.SetStateAction<Set<string | number>>
  >,
  removeItems: (
    ids: (string | number)[]
  ) => void
) {
  /** @brief Toggle item selection */
  const toggleSelection = useCallback(
    (id: string | number) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
    },
    []
  )

  /** @brief Select all items */
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getId)))
  }, [items, getId])

  /** @brief Clear all selections */
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  /** @brief Remove all selected items */
  const removeSelected = useCallback(() => {
    removeItems(Array.from(selectedIds))
  }, [selectedIds, removeItems])

  return {
    toggleSelection,
    selectAll,
    clearSelection,
    removeSelected,
  }
}
