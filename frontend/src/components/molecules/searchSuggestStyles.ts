/**
 * Inline style presets for SearchSuggestDropdown.
 * Pulled out so the component file stays under the
 * 100-LOC project cap.
 *
 * @module components/molecules/searchSuggestStyles
 */
import type { CSSProperties } from 'react';

export const PANEL: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  background: 'var(--md-sys-color-surface-container)',
  border:
    '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: 12,
  boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
  zIndex: 1300,
  overflow: 'hidden',
};

export const LIST: CSSProperties = {
  listStyle: 'none', margin: 0, padding: 0,
};

export const ROW_TOP: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
};

export const BADGE: CSSProperties = {
  fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase',
  padding: '2px 8px', borderRadius: 999,
  background: 'var(--md-sys-color-secondary-container)',
  color: 'var(--md-sys-color-on-secondary-container)',
  flexShrink: 0,
};

export const TITLE: CSSProperties = {
  fontWeight: 600, whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis',
};

export const SNIPPET: CSSProperties = {
  fontSize: 13, opacity: 0.7,
  whiteSpace: 'nowrap', overflow: 'hidden',
  textOverflow: 'ellipsis', marginTop: 2,
};

/** Per-row style with active-state background. */
export function rowStyle(active: boolean): CSSProperties {
  return {
    padding: '10px 14px',
    cursor: 'pointer',
    background: active
      ? 'var(--md-sys-color-surface-container-high)'
      : 'transparent',
  };
}

/** Footer "view all" row style. */
export function viewAllStyle(
  active: boolean,
): CSSProperties {
  return {
    padding: '12px 14px',
    cursor: 'pointer',
    fontWeight: 600,
    borderTop:
      '1px solid var(--md-sys-color-outline-variant)',
    background: active
      ? 'var(--md-sys-color-surface-container-high)'
      : 'transparent',
  };
}
