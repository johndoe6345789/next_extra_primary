import type { ConstraintType }
  from './constraintDialogTypes';

/** Props for the add-constraint form. */
export interface ConstraintAddFormProps {
  constraintName: string;
  onConstraintNameChange: (
    v: string
  ) => void;
  constraintType: string;
  onConstraintTypeChange: (
    v: string
  ) => void;
  constraintTypes: ConstraintType[];
  columnName: string;
  onColumnNameChange: (v: string) => void;
  checkExpression: string;
  onCheckExpressionChange: (
    v: string
  ) => void;
  currentType: ConstraintType | undefined;
}
