'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Props for the TableHead component */
export interface TableHeadProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Table header row elements */
  children?: React.ReactNode
}

/**
 * TableHead - semantic thead wrapper for header rows.
 */
export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = '',
  ...props
}) => (
  <thead
    className={`${styles.head} ${className}`}
    data-testid="table-head"
    {...props}
  >
    {children}
  </thead>
)

export default TableHead
