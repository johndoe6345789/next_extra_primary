/** Inline styles for AlertsBell badge. */

import React from 'react'

export const WRAP_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
}

export const BADGE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 2,
  right: 2,
  minWidth: 18,
  height: 18,
  padding: '0 5px',
  borderRadius: 9,
  background: 'var(--md-sys-color-error, #b3261e)',
  color: 'var(--md-sys-color-on-error, #fff)',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '18px',
  textAlign: 'center',
  pointerEvents: 'none',
}
