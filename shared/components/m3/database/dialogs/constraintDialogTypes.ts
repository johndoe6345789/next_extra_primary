/**
 * Type definitions for ConstraintDialog.
 */

/** Configuration for a constraint type. */
export type ConstraintType = {
  name: string;
  description: string;
  requiresColumn: boolean;
  requiresExpression: boolean;
};

/** Info about an existing constraint. */
export type ConstraintInfo = {
  constraint_name: string;
  constraint_type?: string;
  column_name?: string;
  check_clause?: string;
};

/** Dialog mode - add or delete. */
export type ConstraintDialogMode =
  | 'add'
  | 'delete';

/** Props for the ConstraintDialog component. */
export type ConstraintDialogProps = {
  open: boolean;
  mode: ConstraintDialogMode;
  constraintTypes: ConstraintType[];
  selectedConstraint?: ConstraintInfo | null;
  onClose: () => void;
  onSubmit: (
    data: Record<string, unknown>
  ) => Promise<void>;
  testId?: string;
};
