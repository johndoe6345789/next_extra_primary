/**
 * Style constants for the ProfileActivity
 * organism.
 * @module components/organisms/profileActivityStyles
 */
import type { CSSProperties } from 'react';
import { t } from '@shared/theme/tokens';

/** Row wrapping input and send button. */
export const inputRow: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  marginBottom: 16,
};

/** Comment input field style. */
export const inputStyle: CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 24,
  fontSize: 14,
  border: `2px solid ${t.outline}`,
  background: t.surfaceContainerHigh,
  color: t.onSurface,
  outline: 'none',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
};

/** Send button style. */
export const btnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 8,
  borderRadius: '50%',
};
