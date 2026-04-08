import type { ConstraintType }
  from './constraintDialogTypes';

/**
 * Check constraint form validity.
 * @param mode - Dialog mode.
 * @param name - Constraint name.
 * @param type - Constraint type value.
 * @param currentType - Resolved type config.
 * @param columnName - Column name value.
 * @param checkExpr - Check expression value.
 * @returns True if form is valid.
 */
export function isConstraintFormValid(
  mode: 'add' | 'delete',
  name: string,
  type: string,
  currentType: ConstraintType | undefined,
  columnName: string,
  checkExpr: string
): boolean {
  if (mode === 'delete') return true;
  if (!name.trim() || !type) return false;
  if (currentType?.requiresColumn &&
    !columnName.trim()) return false;
  if (currentType?.requiresExpression &&
    !checkExpr.trim()) return false;
  return true;
}
