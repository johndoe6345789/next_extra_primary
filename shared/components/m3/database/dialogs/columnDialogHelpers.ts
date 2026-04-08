import type { ColumnDialogMode } from './ColumnDialog';

/**
 * Build the dialog title based on mode.
 * @param mode - Current dialog mode.
 * @param tableName - Active table name.
 * @returns Formatted title string.
 */
export function getColumnDialogTitle(
  mode: ColumnDialogMode,
  tableName: string
): string {
  const titles: Record<string, string> = {
    add: `Add Column to ${tableName}`,
    modify: `Modify Column in ${tableName}`,
    drop: `Drop Column from ${tableName}`,
  };
  return titles[mode] || 'Column Operation';
}

/**
 * Check whether the column form is valid.
 * @param mode - Current dialog mode.
 * @param columnName - Column name value.
 * @param columnType - Column type value.
 * @param selectedColumn - Selected column.
 * @returns True if valid for submission.
 */
export function isColumnFormValid(
  mode: ColumnDialogMode,
  columnName: string,
  columnType: string,
  selectedColumn: string
): boolean {
  return mode === 'add'
    ? !!(columnName.trim() && columnType)
    : !!selectedColumn.trim();
}

/**
 * Build the submit button label.
 * @param mode - Current dialog mode.
 * @returns Label text.
 */
export function getColumnSubmitLabel(
  mode: ColumnDialogMode
): string {
  if (mode === 'add') return 'Add Column';
  if (mode === 'modify') return 'Modify Column';
  return 'Drop Column';
}
