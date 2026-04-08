'use client';

import { Typography } from '../../data-display';
import { ConstraintAddForm }
  from './ConstraintAddForm';
import type {
  ConstraintInfo, ConstraintType,
} from './constraintDialogTypes';

/** Props for ConstraintDialogContent. */
export interface ConstraintDialogContentProps {
  mode: 'add' | 'delete';
  selectedConstraint?: ConstraintInfo | null;
  constraintName: string;
  setConstraintName: (v: string) => void;
  constraintType: string;
  setConstraintType: (v: string) => void;
  constraintTypes: ConstraintType[];
  columnName: string;
  setColumnName: (v: string) => void;
  checkExpression: string;
  setCheckExpression: (v: string) => void;
  currentType?: ConstraintType;
}

/**
 * Content area for the ConstraintDialog,
 * showing delete warning or add form.
 */
export function ConstraintDialogContent({
  mode, selectedConstraint,
  constraintName, setConstraintName,
  constraintType, setConstraintType,
  constraintTypes,
  columnName, setColumnName,
  checkExpression, setCheckExpression,
  currentType,
}: ConstraintDialogContentProps) {
  if (mode === 'delete') {
    return (
      <Typography variant="body2"
        color="error" gutterBottom>
        Delete "
        {selectedConstraint?.constraint_name}
        "? This cannot be undone.
      </Typography>
    );
  }
  return (
    <ConstraintAddForm
      constraintName={constraintName}
      onConstraintNameChange={
        setConstraintName}
      constraintType={constraintType}
      onConstraintTypeChange={
        setConstraintType}
      constraintTypes={constraintTypes}
      columnName={columnName}
      onColumnNameChange={setColumnName}
      checkExpression={checkExpression}
      onCheckExpressionChange={
        setCheckExpression}
      currentType={currentType} />
  );
}
