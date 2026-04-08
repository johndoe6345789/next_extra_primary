'use client';

import React from 'react';

interface DataGridFooterProps {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * DataGridFooter - Pagination controls
 * showing current range and prev/next buttons.
 */
export function DataGridFooter({
  page,
  pageSize,
  totalRows,
  totalPages,
  onPageChange,
}: DataGridFooterProps) {
  const start = page * pageSize + 1;
  const end = Math.min(
    (page + 1) * pageSize,
    totalRows
  );

  return (
    <div className="m3-datagrid-footer">
      <div className="m3-datagrid-pagination">
        <span>
          {start}&ndash;{end} of {totalRows}
        </span>
        <button
          disabled={page === 0}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="m3-datagrid-pagination-btn"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="m3-datagrid-pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataGridFooter;
