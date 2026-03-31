'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-list.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the ListItemText component */
export interface ListItemTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary text line */
  primary?: React.ReactNode
  /** Secondary text line */
  secondary?: React.ReactNode
  /** Style props for primary text */
  primaryTypographyProps?: React.CSSProperties & {
    fontWeight?: number | string
  }
}

/**
 * ListItemText - text content for list items.
 * Renders primary and optional secondary text lines
 * inside a list item.
 */
export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
  primaryTypographyProps,
  className = '',
  ...props
}) => (
  <div
    className={
      `${s('mdc-list-item__content')} ${className}`
    }
    data-testid="list-item-text"
    {...props}
  >
    {primary && (
      <span
        className={s('mdc-list-item__primary-text')}
        style={primaryTypographyProps}
      >
        {primary}
      </span>
    )}
    {secondary && (
      <span className={s('mdc-list-item__secondary-text')}>
        {secondary}
      </span>
    )}
  </div>
)

export default ListItemText
