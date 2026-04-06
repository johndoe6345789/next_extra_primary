'use client';

import { useState } from 'react';
import Box from '@shared/m3/Box';
import IconButton from '@shared/m3/IconButton';
import Tooltip from '@shared/m3/Tooltip';
import { Add as AddIcon } from '@shared/icons/Add';
import { Restore as RestoreIcon }
  from '@shared/icons/Restore';
import { useTranslations } from 'next-intl';
import type {
  DashboardLayout, WidgetId,
} from '@/types/dashboard';
import WidgetPicker from './WidgetPicker';

/** Props for the DashboardToolbar. */
export interface DashboardToolbarProps {
  /** Current layout with visibility state. */
  layout: DashboardLayout;
  /** Toggle a widget's visibility. */
  onToggle: (id: WidgetId) => void;
  /** Reset layout to defaults. */
  onReset: () => void;
}

/**
 * Toolbar above the dashboard grid with buttons
 * to add widgets and reset the layout.
 */
export default function DashboardToolbar({
  layout, onToggle, onReset,
}: DashboardToolbarProps) {
  const t = useTranslations('dashboard');
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1, mb: 2,
      }}
      data-testid="dashboard-toolbar"
    >
      <Tooltip title={t('addWidget')}>
        <IconButton
          onClick={() => setPickerOpen(true)}
          aria-label={t('addWidget')}
          data-testid="add-widget-btn"
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('resetLayout')}>
        <IconButton
          onClick={onReset}
          aria-label={t('resetLayout')}
          data-testid="reset-layout-btn"
        >
          <RestoreIcon />
        </IconButton>
      </Tooltip>
      <WidgetPicker
        open={pickerOpen}
        layout={layout}
        onToggle={onToggle}
        onClose={() => setPickerOpen(false)}
      />
    </Box>
  );
}
