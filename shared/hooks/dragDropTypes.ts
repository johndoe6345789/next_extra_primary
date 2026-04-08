/**
 * Type definitions for useDragDrop hook
 */

/** Dragged item data */
export interface DragItem {
  /** Unique identifier */
  id: string
  /** Item type for filtering drops */
  type: string
  /** Additional attached data */
  data: unknown
}

/** Drop position relative to target */
export interface DropPosition {
  /** ID of the drop target */
  targetId: string
  /** Position: before, after, or inside */
  position: 'before' | 'after' | 'inside'
}

/** Return type of useDragDrop */
export interface UseDragDropReturn {
  /** Currently dragged item or null */
  draggedItem: DragItem | null
  /** Current drop target ID or null */
  dropTarget: string | null
  /** Drop position or null */
  dropPosition:
    | 'before'
    | 'after'
    | 'inside'
    | null
  /** Start dragging an item */
  handleDragStart: (
    item: DragItem,
    e: React.DragEvent
  ) => void
  /** End drag operation */
  handleDragEnd: () => void
  /** Handle drag over a target */
  handleDragOver: (
    targetId: string,
    e: React.DragEvent
  ) => void
  /** Handle drag leaving target */
  handleDragLeave: (
    e: React.DragEvent
  ) => void
  /** Handle drop on target */
  handleDrop: (
    targetId: string,
    e: React.DragEvent,
    onDrop?: (
      item: DragItem,
      target: DropPosition
    ) => void
  ) => void
}
