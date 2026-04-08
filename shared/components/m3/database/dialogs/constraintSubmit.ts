import type { ConstraintType }
  from './constraintDialogTypes';

/**
 * Build add-constraint submit payload.
 * @param name - Constraint name.
 * @param type - Constraint type string.
 * @param currentType - Type configuration.
 * @param columnName - Column name.
 * @param checkExpression - Check expression.
 * @returns Record for submission.
 */
export function buildConstraintPayload(
  name: string,
  type: string,
  currentType: ConstraintType | undefined,
  columnName: string,
  checkExpression: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    constraintName: name,
    constraintType: type,
  };
  if (currentType?.requiresColumn)
    data.columnName = columnName;
  if (currentType?.requiresExpression)
    data.checkExpression = checkExpression;
  return data;
}
