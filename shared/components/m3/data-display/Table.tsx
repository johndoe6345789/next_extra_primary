import React from 'react'
import styles
  from '../../../scss/components/Table.module.scss'
import { TableProps } from './TableTypes'

export type {
  TableSize, TablePadding,
  TableAlign, TableProps,
} from './TableTypes'

export * from './TableExports'

/**
 * Table - data table with M3 styling.
 */
export const Table: React.FC<TableProps> = ({
  children, className = '',
  size = 'medium',
  stickyHeader = false,
  striped = false,
  bordered = false,
  compact = false,
  testId, ...props
}) => {
  const classes = [
    styles.table,
    styles[size],
    stickyHeader && styles.stickyHeader,
    striped && styles.striped,
    bordered && styles.bordered,
    compact && styles.compact,
    className,
  ].filter(Boolean).join(' ')
  return (
    <table className={classes}
      data-testid={testId} {...props}>
      {children}
    </table>
  )
}

export default Table
