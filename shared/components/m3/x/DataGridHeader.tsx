'use client';

import React from 'react';
import { classNames } from '../utils/classNames';
import {
  GridColDef,
  GridSortModel,
} from './dataGridTypes';

interface DataGridHeaderProps {
  columns: GridColDef[];
  currentSort: GridSortModel[];
  checkboxSelection: boolean;
  allSelected: boolean;
  onSort: (field: string) => void;
  onSelectAll: () => void;
}

/**
 * DataGridHeader - Table header row with
 * sort indicators and optional checkbox.
 */
export function DataGridHeader({
  columns,
  currentSort,
  checkboxSelection,
  allSelected,
  onSort,
  onSelectAll,
}: DataGridHeaderProps) {
  return (
    <thead>
      <tr>
        {checkboxSelection && (
          <th className="m3-datagrid-checkbox-cell">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
            />
          </th>
        )}
        {columns.map((col) => {
          const sort = currentSort.find(
            (s) => s.field === col.field
          );
          return (
            <th
              key={col.field}
              style={{
                width: col.width,
                flex: col.flex,
                textAlign:
                  col.headerAlign || 'left',
              }}
              onClick={() =>
                col.sortable !== false &&
                onSort(col.field)
              }
              className={classNames(
                'm3-datagrid-header-cell',
                col.sortable !== false &&
                  'm3-datagrid-header-cell--sortable'
              )}
            >
              {col.headerName}
              {sort && (
                <span className="m3-datagrid-sort-icon">
                  {sort.sort === 'asc'
                    ? '\u2191'
                    : '\u2193'}
                </span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default DataGridHeader;
