/**
 * Type definitions for useListOperations hook
 */

/** Configuration options for list operations */
export interface ListOperationsOptions<T> {
  /** Initial items in the list */
  initialItems?: T[]
  /** Extract ID from an item (default: item.id) */
  getId?: (item: T) => string | number
  /** Callback when items change */
  onItemsChange?: (items: T[]) => void
}

/** Return type of useListOperations */
export interface UseListOperationsReturn<T> {
  /** Current items in the list */
  items: T[]
  /** Array of selected item IDs */
  selectedIds: (string | number)[]
  /** Number of selected items */
  selectedCount: number
  /** Whether the list is empty */
  isEmpty: boolean
  /** Set items directly */
  setItems: (
    items: T[] | ((prev: T[]) => T[])
  ) => void
  /** Add an item to the list */
  addItem: (item: T, position?: number) => void
  /** Update an item by ID */
  updateItem: (
    id: string | number,
    updates: Partial<T> | ((item: T) => T)
  ) => void
  /** Remove an item by ID */
  removeItem: (id: string | number) => void
  /** Remove multiple items by IDs */
  removeItems: (ids: (string | number)[]) => void
  /** Move item from one position to another */
  moveItem: (
    fromIndex: number,
    toIndex: number
  ) => void
  /** Toggle selection of an item */
  toggleSelection: (id: string | number) => void
  /** Select all items */
  selectAll: () => void
  /** Clear all selections */
  clearSelection: () => void
  /** Remove all selected items */
  removeSelected: () => void
  /** Find an item by ID */
  findById: (
    id: string | number
  ) => T | undefined
  /** Clear all items and selections */
  clear: () => void
}
