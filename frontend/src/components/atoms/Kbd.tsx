'use client';

import React from 'react';
import Box from '@mui/material/Box';

/** Props for the Kbd atom. */
export interface KbdProps {
  /** Key combo string, e.g. "⌘H" or "/". */
  combo: string;
  /** data-testid for testing. */
  testId?: string;
}

/**
 * Renders a styled keyboard shortcut badge.
 * Uses a monospace font with a subtle border,
 * matching the platform convention for `<kbd>`.
 *
 * @param props - Component props.
 * @returns Styled kbd element.
 */
export const Kbd: React.FC<KbdProps> = ({ combo, testId = 'kbd' }) => (
  <Box
    component="kbd"
    data-testid={testId}
    sx={{
      display: 'inline-block',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1,
      px: 0.75,
      py: 0.25,
      mx: 0.25,
      borderRadius: 0.5,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'action.hover',
      color: 'text.secondary',
      whiteSpace: 'nowrap',
    }}
  >
    {combo}
  </Box>
);

export default Kbd;
