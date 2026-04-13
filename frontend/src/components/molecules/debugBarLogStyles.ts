/**
 * Log-panel styles for the DebugBar molecule.
 * @module components/molecules/debugBarLogStyles
 */
import type { CSSProperties } from 'react';

/** Log panel style helpers. */
export const debugBarLogStyles = {
  log: {
    maxHeight: 220,
    overflowY: 'auto',
    borderTop: '1px solid #333',
  } as CSSProperties,

  row: {
    display: 'flex',
    gap: 6,
    padding: '2px 10px',
    borderBottom: '1px solid #222',
  } as CSSProperties,

  ts: {
    color: '#666',
    flexShrink: 0,
    minWidth: 60,
  } as CSSProperties,
};
