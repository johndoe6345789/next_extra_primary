/** Column definition for a new table. */
export type TableColumn = {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  primaryKey: boolean;
};

/** Props for the CreateTableDialog. */
export type CreateTableDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (
    tableName: string,
    columns: TableColumn[]
  ) => Promise<void>;
  dataTypes: string[];
  testId?: string;
};

/** Default column template. */
export const DEFAULT_COL: TableColumn = {
  name: '',
  type: 'VARCHAR',
  length: 255,
  nullable: true,
  primaryKey: false,
};
