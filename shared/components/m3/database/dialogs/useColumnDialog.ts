'use client';

import { useEffect, useState } from 'react';

/**
 * State hook for the ColumnDialog.
 * @param open - Whether dialog is open.
 * @returns Column dialog state and setters.
 */
export function useColumnDialog(open: boolean) {
  const [columnName, setColumnName] =
    useState('');
  const [columnType, setColumnType] =
    useState('VARCHAR');
  const [nullable, setNullable] = useState(true);
  const [defaultValue, setDefaultValue] =
    useState('');
  const [selectedColumn, setSelectedColumn] =
    useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setColumnName('');
      setColumnType('VARCHAR');
      setNullable(true);
      setDefaultValue('');
      setSelectedColumn('');
    }
  }, [open]);

  return {
    columnName,
    setColumnName,
    columnType,
    setColumnType,
    nullable,
    setNullable,
    defaultValue,
    setDefaultValue,
    selectedColumn,
    setSelectedColumn,
    loading,
    setLoading,
  };
}
