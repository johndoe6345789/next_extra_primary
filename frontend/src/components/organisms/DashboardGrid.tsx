'use client';

import Grid from '@shared/m3/Grid';
import { useTranslations } from 'next-intl';
import { useDashboardLayout } from '@/hooks';
import { DraggableWidget } from
  '@/components/molecules';
import { widgetMap } from './widgets/widgetMap';
import {
  spanMap, labelMap,
} from './widgets/widgetRegistry';
import DashboardToolbar from './DashboardToolbar';
import DashboardGridDnd from './DashboardGridDnd';

/**
 * Main dashboard grid with drag-and-drop
 * reordering, widget add/remove, and persistent
 * layout.
 */
export default function DashboardGrid() {
  const t = useTranslations('dashboard');
  const { layout, reorder, toggle, reset } =
    useDashboardLayout();
  const visible = layout.filter((w) => w.visible);
  const ids = visible.map((w) => w.id);

  return (
    <>
      <DashboardToolbar
        layout={layout}
        onToggle={toggle} onReset={reset}
      />
      <DashboardGridDnd
        ids={ids} layout={layout}
        reorder={reorder}
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
                  title={t(
                    labelMap[w.id] ?? w.id,
                  )}
                  onRemove={() => toggle(w.id)}
                  testId={`widget-${w.id}`}
                >
                  <Comp />
                </DraggableWidget>
              </Grid>
            );
          })}
        </Grid>
      </DashboardGridDnd>
    </>
  );
}
