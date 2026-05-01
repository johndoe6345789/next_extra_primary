'use client';

/**
 * Quiet "← Foo" link tucked at the top-left of a
 * PolishPanel. Standardises spacing/colour so every
 * detail page in the polished UI gets the same low-key
 * back-to-list affordance.
 *
 * @module components/molecules/PanelBackLink
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Button } from '@shared/m3/Button';
import { Link } from '@/i18n/navigation';

/** Props for PanelBackLink. */
export interface PanelBackLinkProps {
  /** Destination path. */
  href: string;
  /** Visible label, including the leading arrow. */
  label: string;
  /** data-testid override. */
  testId?: string;
}

/**
 * Restrained back link for the top of a polished
 * detail page.
 *
 * @param props - Component props.
 */
export const PanelBackLink: React.FC<
  PanelBackLinkProps
> = ({ href, label, testId = 'panel-back' }) => (
  <Box sx={{ marginBottom: '16px', marginLeft: '-8px' }}>
    <Button component={Link} href={href}
      variant="text" size="small"
      data-testid={testId}
      sx={{
        color: 'text.secondary',
        fontSize: '0.8rem', opacity: 0.7, gap: 0.5,
        '&:hover': {
          color: 'primary.main',
          opacity: 1, bgcolor: 'transparent',
        },
      }}>
      {label}
    </Button>
  </Box>
);

export default PanelBackLink;
