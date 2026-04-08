'use client';

import {
  Select, Checkbox, FormControlLabel,
} from '../../inputs';

/** Props for column modification fields. */
export interface ColumnModifyFieldsProps {
  selectedColumn: string;
  columnType: string;
  onColumnTypeChange: (v: string) => void;
  nullable: boolean;
  onNullableChange: (v: boolean) => void;
  dataTypes: string[];
}

/**
 * Type and nullable fields shown when modifying
 * an existing column.
 */
export function ColumnModifyFields({
  selectedColumn, columnType,
  onColumnTypeChange,
  nullable, onNullableChange, dataTypes,
}: ColumnModifyFieldsProps) {
  if (!selectedColumn) return null;
  return (
    <>
      <Select fullWidth value={columnType}
        onChange={(e) =>
          onColumnTypeChange(
            e.target.value as string)}
        sx={{ mb: 2 }}>
        {dataTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <FormControlLabel
        control={
          <Checkbox checked={nullable}
            onChange={(e) =>
              onNullableChange(
                e.target.checked)} />
        }
        label="Nullable" />
    </>
  );
}

export default ColumnModifyFields;
