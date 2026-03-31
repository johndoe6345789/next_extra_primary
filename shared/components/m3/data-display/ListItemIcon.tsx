'use client'

import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-list.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the ListItemIcon component */
export interface ListItemIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon element to render */
  children?: React.ReactNode
  /** Inline style overrides via sx map */
  sx?: Record<string, unknown>
}

/**
 * ListItemIcon - icon container for list items.
 * Wraps an icon at the leading edge of a ListItem.
 */
export const ListItemIcon: React.FC<ListItemIconProps> = ({
  children,
  className = '',
  sx,
  style,
  ...props
}) => (
  <span
    className={
      `${s('mdc-list-item__start')} ` +
      `${s('mat-mdc-list-item-icon')} ${className}`
    }
    style={{ ...sxToStyle(sx), ...style }}
    data-testid="list-item-icon"
    aria-hidden="true"
    {...props}
  >
    {children}
  </span>
)

export default ListItemIcon
