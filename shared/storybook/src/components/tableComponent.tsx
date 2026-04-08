/**
 * Table and pagination components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Data table. */
export const Table: React.FC<
  ComponentProps & {
    columns?: Array<{
      field: string; headerName: string
      width?: number
    }>
    rows?: Array<Record<string, unknown>>
  }
> = ({
  columns = [], rows = [], className = '',
}) => (
  <div className={`overflow-auto ${className}`}>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-muted">
          {columns.map((col) => (
            <th
              key={col.field}
              className={
                'text-left px-4 py-2'
                + ' font-medium border-b'
              }
              style={{ width: col.width }}
            >
              {col.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className="border-b hover:bg-muted/50"
          >
            {columns.map((col) => (
              <td
                key={col.field}
                className="px-4 py-2"
              >
                {String(row[col.field] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

/** Pagination controls. */
export const Pagination: React.FC<
  ComponentProps & {
    count?: number; page?: number
  }
> = ({
  count = 1, page = 1,
  className = 'flex items-center gap-2',
}) => (
  <div className={className}>
    <button
      className="px-2 py-1 border rounded"
      disabled={page <= 1}
    >
      &larr;
    </button>
    <span className="text-sm">
      Page {page} of {count}
    </span>
    <button
      className="px-2 py-1 border rounded"
      disabled={page >= count}
    >
      &rarr;
    </button>
  </div>
)
