import React from 'react'
import styles from '../../../scss/components/Table.module.scss'
import {
  TableCellProps,
  TableContainerProps,
} from './TableTypes'

export type { TableCellProps, TableContainerProps }
  from './TableTypes'

/**
 * TableCell with alignment and padding variants
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
  const cap =
    align.charAt(0).toUpperCase() + align.slice(1)
  const classes = [
    styles.cell,
    align && styles[`align${cap}`],
    padding === 'checkbox' &&
      styles.paddingCheckbox,
    padding === 'none' && styles.paddingNone,
    className,
  ]
    .filter(Boolean)
    .join(' ')

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
      {...props}
    >
      {children}
    </Tag>
  )
}

/**
 * Scrollable container for tables
 */
export const TableContainer: React.FC<
  TableContainerProps
> = ({
  children,
  maxHeight,
  className = '',
  style,
  ...props
}) => (
  <div
    className={`${styles.tableContainer} ${className}`}
    style={{ ...style, maxHeight }}
    {...props}
  >
    {children}
  </div>
)
