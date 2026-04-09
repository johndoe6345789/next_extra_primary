/**
 * Style constants for the WidgetCard molecule.
 * @module components/molecules/widgetCardStyles
 */
import type { CSSProperties } from 'react';
import { t } from '@shared/theme/tokens';

/** Pill toggle style when enabled. */
export const pillOn: CSSProperties = {
  padding: '2px 10px',
  borderRadius: 99,
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  background: t.primary,
  color: t.onPrimary,
};

/** Pill toggle style when disabled. */
export const pillOff: CSSProperties = {
  ...pillOn,
  background: t.surfaceVariant,
  color: t.onSurfaceVariant,
};

/** Scaled-down live preview of a widget. */
export const previewBox: CSSProperties = {
  height: 100,
  overflow: 'hidden',
  borderRadius: 8,
  border: `1px solid ${t.outlineVariant}`,
  transform: 'scale(0.55)',
  transformOrigin: 'top left',
  width: '182%',
  pointerEvents: 'none',
  marginBottom: -40,
};

/** Outer card container style. */
export const cardStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: `1px solid ${t.outlineVariant}`,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

/** Header row style. */
export const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
