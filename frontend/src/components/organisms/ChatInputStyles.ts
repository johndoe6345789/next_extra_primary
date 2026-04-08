/**
 * Style constants for the ChatInput component.
 * @module components/organisms/ChatInputStyles
 */
import type React from 'react';

/** Container style for the input bar. */
export const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: 16,
  borderTop:
    '1px solid var(--mat-sys-outline-variant'
    + ', #ccc)',
  alignItems: 'center',
};

/** Wrapper style for the text field. */
export const fieldWrapper = {
  flex: 1,
  minWidth: 0,
  '--mat-sys-corner-extra-small': '24px',
} as React.CSSProperties;
