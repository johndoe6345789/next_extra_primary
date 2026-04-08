import React from 'react'
import styles from '../../../scss/components/Table.module.scss'
import { TableSortLabelProps } from './TablePaginationTypes'

export type { TableSortLabelProps }
  from './TablePaginationTypes'

/**
 * TableSortLabel - clickable sort indicator
 */
export const TableSortLabel: React.FC<
  TableSortLabelProps
> = ({
  active = false,
  direction = 'asc',
  onClick,
  children,
  hideSortIcon = false,
  IconComponent,
  className = '',
  ...props
}) => {
  const classes = [
    styles.sortLabel,
    active && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const sortIcon = IconComponent ? (
    <IconComponent
      className={`${styles.sortIcon} ${styles[direction]}`}
      direction={direction}
    />
  ) : (
    <span
      className={`${styles.sortIcon} ${styles[direction]}`}
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
  )

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
      {...props}
    >
      {children}
      {(!hideSortIcon || active) && sortIcon}
    </span>
  )
}
