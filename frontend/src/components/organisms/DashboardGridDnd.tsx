'use client';

import {
  DndContext, closestCenter,
  PointerSensor, KeyboardSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

/** Props for the DndWrapper component. */
export interface DashboardDndProps {
  /** Ordered list of sortable IDs. */
  ids: string[];
  /** Full layout for reorder logic. */
  layout: Array<{ id: string; visible: boolean }>;
  /** Reorder callback (from, to). */
  reorder: (from: number, to: number) => void;
  /** Children to render inside the DnD context. */
  children: ReactNode;
}

/**
 * DnD context wrapper for the dashboard grid.
 * Handles sensor setup and drag-end reordering.
 */
export default function DashboardGridDnd({
  ids, layout, reorder, children,
}: DashboardDndProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = layout.findIndex(
      (w) => w.id === active.id,
    );
    const to = layout.findIndex(
      (w) => w.id === over.id,
    );
    if (from !== -1 && to !== -1) {
      reorder(from, to);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={ids}
        strategy={rectSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
