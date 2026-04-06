'use client';

import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import WidgetCard
  from '@/components/molecules/WidgetCard';
import { useTranslations } from 'next-intl';
import type {
  DashboardLayout, WidgetId,
} from '@/types/dashboard';
import { widgetMap } from './widgets/widgetMap';
import registryJson from
  '@/constants/dashboard-widgets.json';

/** Props for the WidgetPicker dialog. */
export interface WidgetPickerProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Current layout state. */
  layout: DashboardLayout;
  /** Toggle a widget's visibility. */
  onToggle: (id: WidgetId) => void;
  /** Close the dialog. */
  onClose: () => void;
}

/**
 * Dialog with a gallery of widget cards. Each
 * card shows a live mini-preview, the widget
 * name, description, and a toggle switch.
 */
export default function WidgetPicker({
  open, layout, onToggle, onClose,
}: WidgetPickerProps) {
  const t = useTranslations('dashboard');
  const visMap = Object.fromEntries(
    layout.map((w) => [w.id, w.visible]),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="widget-picker-title"
      data-testid="widget-picker"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="widget-picker-title">
        {t('manageWidgets')}
      </DialogTitle>
      <DialogContent>
        <div style={gridStyle}>
          {registryJson.map((w) => {
            const Comp = widgetMap[
              w.id as WidgetId
            ];
            const on = visMap[w.id] ?? true;
            return (
              <WidgetCard
                key={w.id}
                id={w.id as WidgetId}
                icon={w.icon}
                label={t(w.labelKey)}
                desc={t(w.descKey)}
                on={on}
                onToggle={onToggle}
                Comp={Comp}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
};
