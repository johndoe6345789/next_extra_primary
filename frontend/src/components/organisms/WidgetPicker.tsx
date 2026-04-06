'use client';

import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import List from '@shared/m3/List';
import ListItemButton
  from '@shared/m3/ListItemButton';
import ListItemText from '@shared/m3/ListItemText';
import { Switch } from '@shared/m3/inputs/Switch';
import { useTranslations } from 'next-intl';
import type {
  DashboardLayout, WidgetId,
} from '@/types/dashboard';
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
 * Dialog listing all available widgets with
 * toggle switches to show/hide each one.
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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="widget-picker-title">
        {t('manageWidgets')}
      </DialogTitle>
      <DialogContent>
        <List>
          {registryJson.map((w) => (
            <ListItemButton key={w.id}>
              <ListItemText
                primary={t(w.labelKey)}
              />
              <Switch
                checked={visMap[w.id] ?? true}
                onChange={() =>
                  onToggle(w.id as WidgetId)
                }
                aria-label={t(w.labelKey)}
                testId={`toggle-${w.id}`}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
