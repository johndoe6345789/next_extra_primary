'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Props for the TableBody component */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Table row elements */
  children?: React.ReactNode
}

/**
 * TableBody - semantic tbody wrapper for table rows.
 */
export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = '',
  ...props
}) => (
  <tbody
    className={`${styles.body} ${className}`}
    data-testid="table-body"
    {...props}
  >
    {children}
  </tbody>
)

export default TableBody
