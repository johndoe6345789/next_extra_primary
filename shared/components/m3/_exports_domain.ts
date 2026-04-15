'use client'

/**
 * Domain barrels: email, workflows, database, code, terminal.
 * Split from index.ts to keep each barrel under 100 LOC.
 */

export * from './email'
export * from './workflows'

export {
  // Grids
  DataGrid as DatabaseDataGrid,
  type DataGridProps as DatabaseDataGridProps,
  type DataGridColumn,
  // Dialogs
  ConfirmDialog,
  type ConfirmDialogProps,
  FormDialog,
  type FormDialogProps,
  type FormDialogField,
  CreateTableDialog,
  type CreateTableDialogProps,
  type TableColumn,
  DropTableDialog,
  type DropTableDialogProps,
  ColumnDialog,
  type ColumnDialogProps,
  type ColumnDialogMode,
  type ColumnInfo,
  ConstraintDialog,
  type ConstraintDialogProps,
  type ConstraintDialogMode,
  type ConstraintType,
  type ConstraintInfo,
  // Tables
  TablesTab,
  type TablesTabProps,
  type TableInfo,
  // Queries
  SQLQueryTab,
  type SQLQueryTabProps,
  QueryBuilderTab,
  type QueryBuilderTabProps,
  type QueryBuilderParams,
  type QueryResult,
  type QueryOperator,
  type WhereCondition,
} from './database'

export {
  MonacoEditor,
  type MonacoEditorProps,
  getMonacoLanguage,
  configureMonacoTypeScript,
  CodePreview,
  type CodePreviewProps,
  SplitView,
  type SplitViewProps,
  type ViewMode,
} from './code'

export {
  Terminal,
  type TerminalProps,
  type TerminalLine,
  TerminalHeader,
  type TerminalHeaderProps,
  TerminalOutput,
  type TerminalOutputProps,
  TerminalInput,
  type TerminalInputProps,
} from './terminal'
