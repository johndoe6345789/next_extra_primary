'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Text alignment for a table cell */
export type TableAlign = 'left' | 'center' | 'right'

/** Props for the TableCell component */
export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Cell content */
  children?: React.ReactNode
  /** Render as th instead of td */
  header?: boolean
  /** Text alignment */
  align?: TableAlign
  /** Cell padding variant */
  padding?: 'checkbox' | 'none' | 'normal'
  /** Scope for header cells */
  scope?: 'col' | 'row'
  /** Sort direction for sortable columns */
  sortDirection?: 'asc' | 'desc' | false
}

/**
 * TableCell - renders a td or th table cell.
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  header,
  align = 'left',
  padding = 'normal',
  scope,
  sortDirection,
  className = '',
  ...props
}) => {
  const Tag = header ? 'th' : 'td'
  const alignKey =
    `align${align.charAt(0).toUpperCase() + align.slice(1)}`

  const classes = [
    styles.cell,
    styles[alignKey],
    padding === 'checkbox' && styles.paddingCheckbox,
    padding === 'none' && styles.paddingNone,
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag
      className={classes}
      scope={header ? scope : undefined}
      aria-sort={
        sortDirection
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
      data-testid="table-cell"
      {...props}
    >
      {children}
    </Tag>
  )
}

export default TableCell
