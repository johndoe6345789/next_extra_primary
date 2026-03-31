'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Props for the TableRow component */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Table cell elements */
  children?: React.ReactNode
  /** Enable hover highlight */
  hover?: boolean
  /** Whether this row is selected */
  selected?: boolean
  /** Click handler (makes row interactive) */
  onClick?: React.MouseEventHandler<HTMLTableRowElement>
}

/**
 * TableRow - semantic tr wrapper with optional
 * hover and selected styling.
 */
export const TableRow: React.FC<TableRowProps> = ({
  children,
  hover,
  selected,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    styles.row,
    hover && styles.hover,
    selected && styles.selected,
    onClick && styles.clickable,
    className,
  ].filter(Boolean).join(' ')

  return (
    <tr
      className={classes}
      onClick={onClick}
      data-testid="table-row"
      aria-selected={selected}
      {...props}
    >
      {children}
    </tr>
  )
}

export default TableRow
