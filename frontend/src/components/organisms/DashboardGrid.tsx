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
import Grid from '@shared/m3/Grid';
import { useTranslations } from 'next-intl';
import { useDashboardLayout } from '@/hooks';
import { DraggableWidget } from
  '@/components/molecules';
import { widgetMap } from './widgets/widgetMap';
import {
  spanMap, labelMap,
} from './widgets/widgetRegistry';
import type { WidgetId } from '@/types/dashboard';
import DashboardToolbar from './DashboardToolbar';

/**
 * Main dashboard grid with drag-and-drop reordering,
 * widget add/remove, and persistent layout.
 */
export default function DashboardGrid() {
  const t = useTranslations('dashboard');
  const { layout, reorder, toggle, reset } =
    useDashboardLayout();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );
  const visible = layout.filter((w) => w.visible);
  const ids = visible.map((w) => w.id);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = layout.findIndex(
      (w) => w.id === active.id,
    );
    const to = layout.findIndex(
      (w) => w.id === over.id,
    );
    if (from !== -1 && to !== -1) reorder(from, to);
  }

  return (
    <>
      <DashboardToolbar
        layout={layout}
        onToggle={toggle} onReset={reset}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ids}
          strategy={rectSortingStrategy}
        >
          <Grid
            container spacing={3}
            data-testid="dashboard-grid"
          >
            {visible.map((w) => {
              const Comp = widgetMap[w.id];
              return (
                <Grid
                  key={w.id} item
                  xs={12} md={spanMap[w.id]}
                >
                  <DraggableWidget
                    id={w.id}
                    title={t(labelMap[w.id] ?? w.id)}
                    onRemove={() => toggle(w.id)}
                    testId={`widget-${w.id}`}
                  >
                    <Comp />
                  </DraggableWidget>
                </Grid>
              );
            })}
          </Grid>
        </SortableContext>
      </DndContext>
    </>
  );
}
