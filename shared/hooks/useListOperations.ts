/**
 * useListOperations Hook
 * List management with CRUD and selection
 */

import { useState, useCallback } from 'react'
import type {
  ListOperationsOptions,
  UseListOperationsReturn,
} from './listOperationsTypes'
import { useListSelection } from './listOperationsSelection'
import { useListCrud } from './listOperationsCrud'

export type {
  ListOperationsOptions,
  UseListOperationsReturn,
} from './listOperationsTypes'

/**
 * Hook for managing list operations
 * @param options - Configuration options
 */
export function useListOperations<T>({
  initialItems = [],
  getId = (item: T) =>
    (item as any).id as string | number,
  onItemsChange,
}: ListOperationsOptions<T> = {}):
  UseListOperationsReturn<T> {
  const [items, setItemsState] = useState<T[]>(initialItems)
  const sel = useListSelection(items, getId)

  const setItems = useCallback(
    (newItems: T[] | ((prev: T[]) => T[])) => {
      setItemsState((prev) => {
        const updated = typeof newItems === 'function' ? newItems(prev) : newItems
        onItemsChange?.(updated)
        return updated
      })
    },
    [onItemsChange]
  )

  const crud = useListCrud(setItems, getId, sel.deselectIds)

  const removeSelected = useCallback(() => {
    crud.removeItems(sel.selectedArray)
  }, [sel.selectedArray, crud])

  const findById = useCallback(
    (id: string | number) => items.find((item) => getId(item) === id),
    [items, getId]
  )

  const clear = useCallback(() => {
    setItems([])
    sel.clearSelection()
  }, [setItems, sel])

  return {
    items,
    selectedIds: sel.selectedArray,
    selectedCount: sel.selectedCount,
    isEmpty: items.length === 0,
    setItems,
    ...crud,
    toggleSelection: sel.toggleSelection,
    selectAll: sel.selectAll,
    clearSelection: sel.clearSelection,
    removeSelected,
    findById,
    clear,
  }
}
