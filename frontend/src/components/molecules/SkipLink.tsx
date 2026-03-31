'use client';

import React from 'react';

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
  <a
    href="#main-content"
    data-testid={testId}
    tabIndex={0}
    style={{
      position: 'absolute',
      left: '-9999px',
    }}
    onFocus={(e) => {
      e.currentTarget.style.left = '8px';
      e.currentTarget.style.top = '8px';
      e.currentTarget.style.zIndex = '9999';
    }}
    onBlur={(e) => {
      e.currentTarget.style.left = '-9999px';
    }}
  >
    {label}
  </a>
);

export default SkipLink;
