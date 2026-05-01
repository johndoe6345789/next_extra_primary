'use client';

/**
 * PolishPanel — the standard "page within a page"
 * surface used across the polished UI: soft radial
 * brand tint at the top, generous radius, ambient
 * shadow, no hard borders. Lifts content off the raw
 * page background.
 *
 * @module components/molecules/PolishPanel
 */
import React, { type ReactNode } from 'react';
import { Box } from '@shared/m3/Box';

/** Padding presets in px shorthand: top right bottom left. */
const PADDING_BY_SIZE = {
  // Detail-page profile: snug top so the back link sits
  // close to the panel edge, balanced bottom for prose.
  comfy: '24px 64px 48px 64px',
  // List-page profile: enough headroom for an editorial
  // header without pushing the grid below the fold.
  spacious: '40px 64px 56px 64px',
} as const;

/** Props for PolishPanel. */
export interface PolishPanelProps {
  /** Panel children. */
  children: ReactNode;
  /** Padding profile. */
  size?: keyof typeof PADDING_BY_SIZE;
  /** ARIA label / role wrapper. */
  ariaLabel?: string;
  /** data-testid override. */
  testId?: string;
}

/**
 * Soft floating paper panel wrapper.
 *
 * @param props - Component props.
 */
export const PolishPanel: React.FC<PolishPanelProps> = ({
  children, size = 'spacious', ariaLabel, testId,
}) => (
  <Box
    aria-label={ariaLabel}
    data-testid={testId}
    sx={{
      background:
        'radial-gradient(ellipse at top,'
        + ' rgba(124,58,237,0.045) 0%,'
        + ' rgba(255,255,255,0.025) 55%)',
      borderRadius: '20px',
      padding: PADDING_BY_SIZE[size],
      boxShadow: '0 12px 48px rgba(0,0,0,0.28)',
      animation:
        'gallery-fade-up 0.5s'
        + ' cubic-bezier(0.22,1,0.36,1) both',
    }}
  >
    {children}
  </Box>
);

export default PolishPanel;
