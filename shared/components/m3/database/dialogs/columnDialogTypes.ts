/** Info for a column in the table. */
export type ColumnInfo = { column_name: string };

/** Dialog modes for column operations. */
export type ColumnDialogMode =
  | 'add' | 'modify' | 'drop';

/** Props for the ColumnDialog component. */
export type ColumnDialogProps = {
  open: boolean;
  mode: ColumnDialogMode;
  tableName: string;
  columns?: ColumnInfo[];
  onClose: () => void;
  onSubmit: (
    data: Record<string, unknown>
  ) => Promise<void>;
  dataTypes: string[];
  testId?: string;
};
