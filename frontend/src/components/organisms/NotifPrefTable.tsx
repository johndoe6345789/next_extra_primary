'use client';

/**
 * Preferences table: categories × channels with
 * M3 Switch cells.
 * @module components/organisms/NotifPrefTable
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Switch from '@shared/m3/Switch';
import type { NotifPrefs }
  from '@/store/api/notificationPrefsApi';

/** Props for NotifPrefTable. */
export interface NotifPrefTableProps {
  /** Current preferences map. */
  prefs: NotifPrefs;
  /** Called with updated prefs on any toggle. */
  onChange: (next: NotifPrefs) => void;
  /** Test ID prefix. */
  testId?: string;
}

/**
 * Renders a grid of categories × channels with
 * Switch toggles for each combination.
 *
 * @param props - Component props.
 */
export function NotifPrefTable({
  prefs,
  onChange,
  testId = 'notif-pref-table',
}: NotifPrefTableProps): React.ReactElement {
  const categories = Object.keys(prefs);

  const toggle = (cat: string, ch: string) => {
    const cur = prefs[cat]?.[ch]?.enabled ?? false;
    onChange({
      ...prefs,
      [cat]: {
        ...prefs[cat],
        [ch]: { enabled: !cur },
      },
    });
  };

  return (
    <Box
      data-testid={testId}
      aria-label="Notification preferences"
      sx={{ overflowX: 'auto' }}
    >
      {categories.map((cat) => (
        <Box key={cat} sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            {cat}
          </Typography>
          {Object.entries(prefs[cat]).map(
            ([ch, v]) => (
              <Box
                key={ch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2, mb: 1,
                }}
              >
                <Typography
                  sx={{ flex: 1 }}
                  variant="body2"
                >
                  {ch}
                </Typography>
                <Switch
                  checked={v.enabled}
                  onChange={() => toggle(cat, ch)}
                  aria-label={`${cat} ${ch}`}
                  data-testid={`pref-${cat}-${ch}`}
                />
              </Box>
            ),
          )}
        </Box>
      ))}
    </Box>
  );
}

export default NotifPrefTable;
