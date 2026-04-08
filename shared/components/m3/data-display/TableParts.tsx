import React from 'react'
import styles from '../../../scss/components/Table.module.scss'
import {
  TableHeadProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
} from './TableTypes'

export type {
  TableHeadProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
} from './TableTypes'

/**
 * TableHead section wrapper
 */
export const TableHead: React.FC<TableHeadProps> = (
  { children, className = '', ...props }
) => (
  <thead
    className={`${styles.head} ${className}`}
    {...props}
  >
    {children}
  </thead>
)

/**
 * TableBody section wrapper
 */
export const TableBody: React.FC<TableBodyProps> = (
  { children, className = '', ...props }
) => (
  <tbody
    className={`${styles.body} ${className}`}
    {...props}
  >
    {children}
  </tbody>
)

/**
 * TableFooter section wrapper
 */
export const TableFooter: React.FC<
  TableFooterProps
> = ({ children, className = '', ...props }) => (
  <tfoot
    className={`${styles.footer} ${className}`}
    {...props}
  >
    {children}
  </tfoot>
)

/**
 * TableRow with hover and selected states
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
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <tr
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  )
}
