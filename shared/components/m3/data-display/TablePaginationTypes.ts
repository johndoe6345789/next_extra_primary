import React from 'react'

/**
 * Args for the displayed rows label function
 */
export interface TablePaginationLabelDisplayedRowsArgs {
  from: number
  to: number
  count: number
  page: number
}

/**
 * Props for the TablePagination component
 */
export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Total number of rows */
  count?: number
  /** Current page (0-indexed) */
  page?: number
  /** Number of rows per page */
  rowsPerPage?: number
  /** Options for rows per page dropdown */
  rowsPerPageOptions?: number[]
  /** Callback for page change */
  onPageChange?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
  /** Callback for rows per page change */
  onRowsPerPageChange?: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void
  /** Label for rows per page dropdown */
  labelRowsPerPage?: React.ReactNode
  /** Custom label for displayed rows */
  labelDisplayedRows?: (
    args: TablePaginationLabelDisplayedRowsArgs
  ) => React.ReactNode
  /** Show first page button */
  showFirstButton?: boolean
  /** Show last page button */
  showLastButton?: boolean
  /** Disable the back button */
  backIconButtonDisabled?: boolean
  /** Disable the next button */
  nextIconButtonDisabled?: boolean
}

/**
 * Props for the TableSortLabel component
 */
export interface TableSortLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Whether column is currently sorted */
  active?: boolean
  /** Sort direction */
  direction?: 'asc' | 'desc'
  /** Click handler */
  onClick?: (
    event:
      | React.MouseEvent<HTMLSpanElement>
      | React.KeyboardEvent<HTMLSpanElement>
  ) => void
  /** Label content */
  children?: React.ReactNode
  /** Hide sort icon when inactive */
  hideSortIcon?: boolean
  /** Custom icon component */
  IconComponent?: React.ComponentType<{
    className?: string
    direction?: 'asc' | 'desc'
  }>
}
