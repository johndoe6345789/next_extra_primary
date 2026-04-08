'use client';

import { Typography } from '../../data-display';
import { ColumnDialogAddForm }
  from './ColumnDialogAddForm';
import { ColumnDialogModifyForm }
  from './ColumnDialogModifyForm';
import type { ColumnDialogMode, ColumnInfo }
  from './columnDialogTypes';

/** Props for the ColumnDialogContent. */
export interface ColumnDialogContentProps {
  mode: ColumnDialogMode;
  columns: ColumnInfo[];
  columnName: string;
  setColumnName: (v: string) => void;
  columnType: string;
  setColumnType: (v: string) => void;
  nullable: boolean;
  setNullable: (v: boolean) => void;
  defaultValue: string;
  setDefaultValue: (v: string) => void;
  selectedColumn: string;
  setSelectedColumn: (v: string) => void;
  dataTypes: string[];
}

/**
 * Content section of the ColumnDialog showing
 * the appropriate form based on mode.
 */
export function ColumnDialogContent({
  mode, columns, columnName, setColumnName,
  columnType, setColumnType,
  nullable, setNullable,
  defaultValue, setDefaultValue,
  selectedColumn, setSelectedColumn,
  dataTypes,
}: ColumnDialogContentProps) {
  return (
    <>
      {mode === 'drop' && (
        <Typography variant="body2"
          color="error" gutterBottom>
          Warning: This will permanently delete
          the column and all its data!
        </Typography>
      )}
      {mode === 'add' ? (
        <ColumnDialogAddForm
          columnName={columnName}
          onColumnNameChange={setColumnName}
          columnType={columnType}
          onColumnTypeChange={setColumnType}
          nullable={nullable}
          onNullableChange={setNullable}
          defaultValue={defaultValue}
          onDefaultValueChange={setDefaultValue}
          dataTypes={dataTypes} />
      ) : (
        <ColumnDialogModifyForm
          mode={mode} columns={columns}
          selectedColumn={selectedColumn}
          onSelectedColumnChange={
            setSelectedColumn}
          columnType={columnType}
          onColumnTypeChange={setColumnType}
          nullable={nullable}
          onNullableChange={setNullable}
          dataTypes={dataTypes} />
      )}
    </>
  );
}
