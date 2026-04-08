'use client';

import {
  Select, FormControl, InputLabel,
} from '../../inputs';
import { SelectedColumnChips }
  from './SelectedColumnChips';

/** Props for table and column selection. */
export interface QueryBuilderTableSelectProps {
  tables: Array<{ table_name: string }>;
  selectedTable: string;
  onTableChange: (name: string) => void;
  selectedColumns: string[];
  onColumnsChange: (cols: string[]) => void;
  availableColumns: string[];
}

/**
 * Table and column selection panel for the
 * query builder.
 */
export function QueryBuilderTableSelect({
  tables, selectedTable, onTableChange,
  selectedColumns, onColumnsChange,
  availableColumns,
}: QueryBuilderTableSelectProps) {
  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Table</InputLabel>
        <Select value={selectedTable}
          onChange={(e) =>
            onTableChange(
              e.target.value as string)}>
          {tables.map((table) => (
            <option key={table.table_name}
              value={table.table_name}>
              {table.table_name}
            </option>
          ))}
        </Select>
      </FormControl>
      {selectedTable && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>
            Select Columns (empty = all)
          </InputLabel>
          <Select multiple
            value={selectedColumns}
            onChange={(e) =>
              onColumnsChange(
                e.target
                  .value as unknown as string[]
              )}>
            {availableColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </Select>
          <SelectedColumnChips
            selectedColumns={
              selectedColumns} />
        </FormControl>
      )}
    </>
  );
}

export default QueryBuilderTableSelect;
