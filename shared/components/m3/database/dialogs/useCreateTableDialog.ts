'use client';

import { useState } from 'react';
import type { TableColumn } from './createTableTypes';
import { DEFAULT_COL } from './createTableTypes';

/**
 * State hook for CreateTableDialog.
 * @returns Table dialog state and helpers.
 */
export function useCreateTableDialog() {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<
    TableColumn[]
  >([{ ...DEFAULT_COL }]);
  const [loading, setLoading] = useState(false);

  /** Reset state and invoke onClose. */
  const reset = () => {
    setTableName('');
    setColumns([{ ...DEFAULT_COL }]);
  };

  /** Update a single column field. */
  const updateColumn = (
    index: number,
    field: keyof TableColumn,
    value: string | number | boolean
  ) => {
    const updated = [...columns];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setColumns(updated);
  };

  /** Add a new blank column. */
  const addColumn = () => {
    setColumns([...columns, { ...DEFAULT_COL }]);
  };

  /** Remove a column by index. */
  const removeColumn = (index: number) => {
    setColumns(
      columns.filter((_, j) => j !== index)
    );
  };

  return {
    tableName, setTableName,
    columns, loading, setLoading,
    reset, updateColumn,
    addColumn, removeColumn,
  };
}
