'use client'

import React from 'react'
import { sxToStyle } from '../utils/sx'

/** Props for the Toolbar component */
export interface ToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Toolbar content */
  children?: React.ReactNode
  /** Use compact height */
  dense?: boolean
  /** Remove horizontal padding */
  disableGutters?: boolean
  /** Toolbar size variant */
  variant?: 'regular' | 'dense'
  /** Inline style overrides via sx map */
  sx?: Record<string, unknown>
}

/**
 * Toolbar - horizontal flexbox row container.
 * Typically placed inside an AppBar or used standalone
 * as a utility bar with actions.
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  dense,
  disableGutters,
  variant,
  className = '',
  sx,
  style,
  ...props
}) => {
  const classes = [
    'toolbar',
    dense || variant === 'dense'
      ? 'toolbar--dense' : '',
    disableGutters ? 'toolbar--no-gutters' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid="toolbar"
      role="toolbar"
      {...props}
    >
      {children}
    </div>
  )
}

export default Toolbar
