/**
 * Inline styles for the DebugBar molecule.
 * @module components/molecules/debugBarStyles
 */
import type { CSSProperties } from 'react';
import { debugBarLogStyles }
  from './debugBarLogStyles';

const mono: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 11,
};

/** Status colour based on HTTP code. */
export const statusClr = (
  s: number,
): string => {
  if (s >= 500) return '#f44';
  if (s >= 400) return '#fa0';
  return '#4c8';
};

/** All debug bar style helpers. */
export const debugBarStyles = {
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    background: '#1a1a2e',
    color: '#ccc',
    borderTop: '1px solid #333',
    ...mono,
  } as CSSProperties,

  summary: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '3px 10px',
    cursor: 'pointer',
    userSelect: 'none',
  } as CSSProperties,

  badge: (authed: boolean): CSSProperties => ({
    background: authed ? '#2d6' : '#f44',
    color: '#000',
    padding: '1px 6px',
    borderRadius: 3,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 10,
  }),

  env: {
    color: '#88f',
    fontWeight: 600,
  } as CSSProperties,

  api: {
    display: 'flex',
    gap: 6,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  } as CSSProperties,

  method: {
    color: '#ff8',
    fontWeight: 700,
    flexShrink: 0,
  } as CSSProperties,

  url: {
    color: '#aaa',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as CSSProperties,

  status: (s: number): CSSProperties => ({
    color: statusClr(s),
    fontWeight: 700,
    flexShrink: 0,
  }),

  dur: {
    color: '#999',
    flexShrink: 0,
  } as CSSProperties,

  toggle: {
    color: '#777',
    flexShrink: 0,
    marginLeft: 'auto',
  } as CSSProperties,

  ...debugBarLogStyles,
};
