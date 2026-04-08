'use client';

import { Select } from '../../inputs';
import { ColumnModifyFields }
  from './ColumnModifyFields';
import type { ColumnInfo }
  from './ColumnDialog';

/** Props for the modify/drop column form. */
export interface ColumnDialogModifyFormProps {
  mode: 'modify' | 'drop';
  columns: ColumnInfo[];
  selectedColumn: string;
  onSelectedColumnChange: (v: string) => void;
  columnType: string;
  onColumnTypeChange: (v: string) => void;
  nullable: boolean;
  onNullableChange: (v: boolean) => void;
  dataTypes: string[];
}

/**
 * Form fields for modifying or dropping a
 * column.
 */
export function ColumnDialogModifyForm({
  mode, columns, selectedColumn,
  onSelectedColumnChange, columnType,
  onColumnTypeChange,
  nullable, onNullableChange, dataTypes,
}: ColumnDialogModifyFormProps) {
  return (
    <>
      <Select fullWidth value={selectedColumn}
        onChange={(e) =>
          onSelectedColumnChange(
            e.target.value as string)}
        displayEmpty
        sx={{ mt: 2, mb: 2 }}>
        <option value="">
          <em>Select a column</em>
        </option>
        {columns.map((col) => (
          <option key={col.column_name}
            value={col.column_name}>
            {col.column_name}
          </option>
        ))}
      </Select>
      {mode === 'modify' && (
        <ColumnModifyFields
          selectedColumn={selectedColumn}
          columnType={columnType}
          onColumnTypeChange={
            onColumnTypeChange}
          nullable={nullable}
          onNullableChange={onNullableChange}
          dataTypes={dataTypes} />
      )}
    </>
  );
}

export default ColumnDialogModifyForm;
