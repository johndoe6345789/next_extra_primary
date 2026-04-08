'use client';

import React from 'react';
import { classNames } from '../utils/classNames';
import { GridColDef } from './dataGridTypes';

interface DataGridBodyProps {
  rows: Record<string, unknown>[];
  columns: GridColDef[];
  checkboxSelection: boolean;
  selectedIds: Set<string | number>;
  getRowId: (row: Record<string, unknown>) => string | number;
  onRowClick: (row: Record<string, unknown>) => void;
}

/** Resolve cell value through getter/formatter chain. */
function resolveCell(
  col: GridColDef, row: Record<string, unknown>,
  id: string | number
): React.ReactNode {
  let value: unknown = row[col.field];
  if (col.valueGetter)
    value = col.valueGetter({ row, field: col.field, id });
  if (col.valueFormatter)
    value = col.valueFormatter({ value, field: col.field, id });
  return col.renderCell
    ? col.renderCell({ value, row, field: col.field, id })
    : (value as React.ReactNode);
}

/**
 * DataGridBody - Renders paginated table rows
 * with optional checkbox selection.
 */
export function DataGridBody({
  rows, columns, checkboxSelection,
  selectedIds, getRowId, onRowClick,
}: DataGridBodyProps) {
  return (
    <tbody>
      {rows.map((row) => {
        const id = getRowId(row);
        const sel = selectedIds.has(id);
        return (
          <tr
            key={id}
            onClick={() => onRowClick(row)}
            className={classNames(
              'm3-datagrid-row',
              sel && 'm3-datagrid-row--selected'
            )}
          >
            {checkboxSelection && (
              <td className="m3-datagrid-checkbox-cell">
                <input
                  type="checkbox" checked={sel}
                  onChange={() => {}}
                />
              </td>
            )}
            {columns.map((col) => (
              <td
                key={col.field}
                style={{ textAlign: col.align || 'left' }}
                className="m3-datagrid-cell"
              >
                {resolveCell(col, row, id)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

export default DataGridBody;
