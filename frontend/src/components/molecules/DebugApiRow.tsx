'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import type { DebugEntry } from '@/utils/debugStore';

/** Props for DebugApiRow. */
export interface DebugApiRowProps {
  /** API call entry. */
  entry: DebugEntry;
}

/** Status color based on HTTP code. */
const statusColor = (s: number): string => {
  if (s >= 500) return 'error.main';
  if (s >= 400) return 'warning.main';
  return 'success.main';
};

/**
 * Single row in the debug API call log.
 */
export const DebugApiRow: React.FC<
  DebugApiRowProps
> = ({ entry }) => (
  <Box
    sx={{
      display: 'flex', gap: 1, py: 0.5,
      fontFamily: 'monospace', fontSize: 12,
      borderBottom:
        '1px solid var(--mat-sys-outline-variant)',
      flexWrap: 'wrap', alignItems: 'center',
    }}
    data-testid="debug-api-row"
  >
    <Typography
      sx={{ fontSize: 11, opacity: 0.6, minWidth: 70 }}
    >
      {entry.timestamp.slice(11, 19)}
    </Typography>
    <Typography
      sx={{ fontWeight: 600, minWidth: 40 }}
    >
      {entry.method}
    </Typography>
    <Typography
      sx={{ flex: 1, minWidth: 0 }}
      noWrap
    >
      {entry.url}
    </Typography>
    <Typography
      sx={{ color: statusColor(entry.status) }}
    >
      {entry.status}
    </Typography>
    <Typography sx={{ opacity: 0.6 }}>
      {entry.duration}ms
    </Typography>
    {entry.errorCode && (
      <Typography color="error" sx={{ fontSize: 11 }}>
        {entry.errorCode}
      </Typography>
    )}
    {entry.requestId && (
      <Typography
        sx={{ fontSize: 10, opacity: 0.5 }}
        title={entry.requestId}
      >
        {entry.requestId.slice(0, 8)}
      </Typography>
    )}
  </Box>
);

export default DebugApiRow;
