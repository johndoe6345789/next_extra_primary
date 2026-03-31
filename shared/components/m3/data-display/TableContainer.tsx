'use client'

import React from 'react'
import styles from '../../../scss/components/Table.module.scss'

/** Props for the TableContainer component */
export interface TableContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Table element to wrap */
  children?: React.ReactNode
  /** Max height for the scrollable area */
  maxHeight?: number | string
  /** Render as different element */
  component?: React.ElementType
}

/**
 * TableContainer - scrollable wrapper around a Table.
 * Adds overflow scrolling and optional max-height.
 */
export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  maxHeight,
  component: Component = 'div',
  className = '',
  style,
  ...props
}) => (
  <Component
    className={`${styles.tableContainer} ${className}`}
    style={{ ...style, maxHeight }}
    data-testid="table-container"
    role="region"
    aria-label="Scrollable table"
    tabIndex={0}
    {...props}
  >
    {children}
  </Component>
)

export default TableContainer
