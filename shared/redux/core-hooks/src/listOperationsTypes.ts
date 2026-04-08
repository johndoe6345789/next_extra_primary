/**
 * List Operations Types
 * Types for the useListOperations hook
 */

/** @brief Options for useListOperations */
export interface ListOperationsOptions<T> {
  initialItems?: T[]
  getId?: (item: T) => string | number
  onItemsChange?: (items: T[]) => void
}

/** @brief Return type for useListOperations */
export interface UseListOperationsReturn<T> {
  items: T[]
  selectedIds: (string | number)[]
  selectedCount: number
  isEmpty: boolean
  setItems: (
    newItems: T[] | ((prev: T[]) => T[])
  ) => void
  addItem: (item: T, position?: number) => void
  updateItem: (
    id: string | number,
    updates: Partial<T> | ((item: T) => T)
  ) => void
  removeItem: (id: string | number) => void
  removeItems: (ids: (string | number)[]) => void
  moveItem: (from: number, to: number) => void
  toggleSelection: (
    id: string | number
  ) => void
  selectAll: () => void
  clearSelection: () => void
  removeSelected: () => void
  findById: (
    id: string | number
  ) => T | undefined
  clear: () => void
}
