/** Inline styles for UserBubble. */

import React from 'react'

export const BUBBLE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  background:
    'var(--md-sys-color-primary, #6750a4)',
  color:
    'var(--md-sys-color-on-primary, #fff)',
  fontSize: 14,
  fontWeight: 600,
}

export const NAME_STYLE: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
}
