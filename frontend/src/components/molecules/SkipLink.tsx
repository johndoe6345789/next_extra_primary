'use client';

import React from 'react';
import Box from '@mui/material/Box';

/** Props for the SkipLink component. */
export interface SkipLinkProps {
  /** Visible label text. */
  label: string;
  /** data-testid for testing. */
  testId?: string;
}

/**
 * Visually hidden skip-to-content link that
 * appears on focus for keyboard navigation.
 *
 * @param props - Component props.
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  label,
  testId = 'skip-to-content',
}) => (
  <Box
    component="a"
    href="#main-content"
    data-testid={testId}
    tabIndex={0}
    sx={{
      position: 'absolute',
      left: '-9999px',
      '&:focus': {
        left: 8,
        top: 8,
        zIndex: 9999,
      },
    }}
  >
    {label}
  </Box>
);

export default SkipLink;
