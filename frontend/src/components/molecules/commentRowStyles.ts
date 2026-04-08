/**
 * Style constants for the CommentRow component.
 * @module components/molecules/commentRowStyles
 */
import type React from 'react';

/** Circular avatar link style. */
export const avatarStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary, #fff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
  marginTop: 2,
};

/** Author name link style. */
export const nameLink: React.CSSProperties = {
  color: 'var(--mat-sys-primary)',
  textDecoration: 'none',
  cursor: 'pointer',
  fontWeight: 600,
};

/** Delete button style. */
export const delBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginLeft: 4,
  verticalAlign: 'middle',
  padding: 0,
};
