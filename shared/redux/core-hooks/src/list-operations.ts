/**
 * useListOperations Hook
 * Comprehensive list management with CRUD
 * and selection support.
 */

import { useState, useCallback } from 'react'
import type {
  ListOperationsOptions,
  UseListOperationsReturn,
} from './listOperationsTypes'
import { useSelectionOps } from './listSelectionOps'

export type {
  ListOperationsOptions,
  UseListOperationsReturn,
} from './listOperationsTypes'

/** @brief List CRUD + selection hook */
export function useListOperations<T>({
  initialItems = [],
  getId = (item: any) => item.id,
  onItemsChange,
}: ListOperationsOptions<T> = {}): UseListOperationsReturn<T> {
  const [items, setItemsState] = useState<T[]>(initialItems)
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())

  const setItems = useCallback((newItems: T[] | ((prev: T[]) => T[])) => {
    setItemsState((prev) => {
      const updated = typeof newItems === 'function' ? newItems(prev) : newItems
      onItemsChange?.(updated)
      return updated
    })
  }, [onItemsChange])

  const addItem = useCallback((item: T, position?: number) => {
    setItems((prev) => {
      if (position !== undefined && position >= 0 && position <= prev.length) {
        const arr = [...prev]; arr.splice(position, 0, item); return arr
      }
      return [...prev, item]
    })
  }, [setItems])

  const updateItem = useCallback((id: string | number, updates: Partial<T> | ((item: T) => T)) => {
    setItems((prev) => prev.map((item) => {
      if (getId(item) === id) return typeof updates === 'function' ? updates(item) : { ...item, ...updates }
      return item
    }))
  }, [getId, setItems])

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((item) => getId(item) !== id))
    setSelectedIds((prev) => { const s = new Set(prev); s.delete(id); return s })
  }, [getId, setItems])

  const removeItems = useCallback((ids: (string | number)[]) => {
    const idSet = new Set(ids)
    setItems((prev) => prev.filter((item) => !idSet.has(getId(item))))
    setSelectedIds((prev) => { const s = new Set(prev); ids.forEach((id) => s.delete(id)); return s })
  }, [getId, setItems])

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev
      const arr = [...prev]; const [moved] = arr.splice(fromIndex, 1); arr.splice(toIndex, 0, moved); return arr
    })
  }, [setItems])

  const findById = useCallback((id: string | number) => items.find((item) => getId(item) === id), [items, getId])
  const clear = useCallback(() => { setItems([]); setSelectedIds(new Set()) }, [setItems])

  const selOps = useSelectionOps(items, getId, selectedIds, setSelectedIds, removeItems)

  return {
    items, selectedIds: Array.from(selectedIds), selectedCount: selectedIds.size, isEmpty: items.length === 0,
    setItems, addItem, updateItem, removeItem, removeItems, moveItem,
    toggleSelection: selOps.toggleSelection, selectAll: selOps.selectAll,
    clearSelection: selOps.clearSelection, removeSelected: selOps.removeSelected,
    findById, clear,
  }
}
