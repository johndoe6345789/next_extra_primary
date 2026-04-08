/**
 * Type definitions for useDragResize hook
 */

import React from 'react';

export const MIN_WIDTH = 200;
export const MIN_HEIGHT = 150;

/** Draggable/resizable item shape */
export interface DragResizeItem {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/** Parameters for useDragResize */
export interface UseDragResizeParams {
  item: DragResizeItem;
  zoom?: number;
  snapToGrid?: (pos: {
    x: number;
    y: number;
  }) => { x: number; y: number };
  onUpdatePosition?: (
    id: string,
    x: number,
    y: number
  ) => void;
  onUpdateSize?: (
    id: string,
    width: number,
    height: number
  ) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  minWidth?: number;
  minHeight?: number;
}

/** Return type of useDragResize */
export interface UseDragResizeReturn {
  cardRef: React.RefObject<
    HTMLDivElement | null
  >;
  isDragging: boolean;
  isResizing: boolean;
  handleDragStart: (
    e: React.MouseEvent
  ) => void;
  handleResizeStart: (
    e: React.MouseEvent,
    direction: string
  ) => void;
}
