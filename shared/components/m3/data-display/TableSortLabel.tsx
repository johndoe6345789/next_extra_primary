'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Props for the TableSortLabel component */
export interface TableSortLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Label content */
  children?: React.ReactNode
  /** Whether this column is currently sorted */
  active?: boolean
  /** Sort direction */
  direction?: 'asc' | 'desc'
  /** Click handler to toggle sort */
  onClick?: (
    e: React.MouseEvent<HTMLSpanElement> |
       React.KeyboardEvent<HTMLSpanElement>
  ) => void
  /** Hide the sort icon when inactive */
  hideSortIcon?: boolean
}

/**
 * TableSortLabel - sortable column header label.
 * Renders an interactive span with a sort-direction
 * arrow indicator.
 */
export const TableSortLabel: React.FC<TableSortLabelProps> = ({
  children,
  active = false,
  direction = 'asc',
  onClick,
  hideSortIcon = false,
  className = '',
  ...props
}) => {
  const classes = [
    styles.sortLabel,
    active && styles.active,
    className,
  ].filter(Boolean).join(' ')

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(e)
    }
  }

  return (
    <span
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      data-testid="table-sort-label"
      {...props}
    >
      {children}
      {(!hideSortIcon || active) && (
        <span
          className={
            `${styles.sortIcon} ${styles[direction]}`
          }
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </span>
      )}
    </span>
  )
}

export default TableSortLabel
