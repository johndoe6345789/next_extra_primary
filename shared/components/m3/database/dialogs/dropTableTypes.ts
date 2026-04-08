/** Info about a database table. */
export type TableInfo = {
  table_name: string;
};

/** Props for the DropTableDialog. */
export type DropTableDialogProps = {
  open: boolean;
  tables: TableInfo[];
  onClose: () => void;
  onDrop: (
    tableName: string
  ) => Promise<void>;
  testId?: string;
};
