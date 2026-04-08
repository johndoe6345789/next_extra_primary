'use client';

import { useEffect, useState } from 'react';
import type {
  ConstraintType,
} from './constraintDialogTypes';

/**
 * State hook for the ConstraintDialog.
 * @param open - Whether dialog is open.
 * @param types - Available constraint types.
 * @returns State values and setters.
 */
export function useConstraintDialog(
  open: boolean,
  types: ConstraintType[]
) {
  const [constraintName, setConstraintName] =
    useState('');
  const [constraintType, setConstraintType] =
    useState('UNIQUE');
  const [columnName, setColumnName] =
    useState('');
  const [checkExpression, setCheckExpression] =
    useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setConstraintName('');
      setConstraintType('UNIQUE');
      setColumnName('');
      setCheckExpression('');
    }
  }, [open]);

  const currentType = types.find(
    (ct) => ct.name === constraintType
  );

  return {
    constraintName,
    setConstraintName,
    constraintType,
    setConstraintType,
    columnName,
    setColumnName,
    checkExpression,
    setCheckExpression,
    loading,
    setLoading,
    currentType,
  };
}
