import React from 'react'
import styles from '../../../scss/components/Table.module.scss'
import { TablePaginationProps } from './TablePaginationTypes'

export type { TablePaginationProps, TablePaginationLabelDisplayedRowsArgs } from './TablePaginationTypes'

const defaultLabel = ({ from, to, count }: { from: number; to: number; count: number }) =>
  `${from}\u2013${to} of ${count !== -1 ? count : `more than ${to}`}`

/** TablePagination - pagination controls for tables */
export const TablePagination: React.FC<TablePaginationProps> = ({
  count = 0, page = 0, rowsPerPage = 10, rowsPerPageOptions = [5, 10, 25],
  onPageChange, onRowsPerPageChange, labelRowsPerPage = 'Rows per page:',
  labelDisplayedRows = defaultLabel, showFirstButton = false, showLastButton = false,
  backIconButtonDisabled, nextIconButtonDisabled, className = '', ...props
}) => {
  const from = count === 0 ? 0 : page * rowsPerPage + 1
  const to = count !== -1 ? Math.min((page + 1) * rowsPerPage, count) : (page + 1) * rowsPerPage
  const totalPages = count !== -1 ? Math.ceil(count / rowsPerPage) : -1
  const isBack = backIconButtonDisabled ?? page === 0
  const isNext = nextIconButtonDisabled ?? (totalPages !== -1 && page >= totalPages - 1)

  return (
    <div className={`${styles.pagination} ${className}`} {...props}>
      <span className={styles.paginationLabel}>{labelRowsPerPage}</span>
      <select className={styles.paginationSelect} value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange?.(e)} aria-label="Rows per page">
        {rowsPerPageOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <span className={styles.paginationDisplayed}>{labelDisplayedRows({ from, to, count, page })}</span>
      <div className={styles.paginationActions}>
        {showFirstButton && (
          <button className={styles.paginationBtn} disabled={isBack} onClick={(e) => onPageChange?.(e, 0)} aria-label="Go to first page" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
          </button>
        )}
        <button className={styles.paginationBtn} disabled={isBack} onClick={(e) => onPageChange?.(e, page - 1)} aria-label="Go to previous page" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button className={styles.paginationBtn} disabled={isNext} onClick={(e) => onPageChange?.(e, page + 1)} aria-label="Go to next page" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        {showLastButton && (
          <button className={styles.paginationBtn} disabled={isNext} onClick={(e) => onPageChange?.(e, Math.max(0, totalPages - 1))} aria-label="Go to last page" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
          </button>
        )}
      </div>
    </div>
  )
}
