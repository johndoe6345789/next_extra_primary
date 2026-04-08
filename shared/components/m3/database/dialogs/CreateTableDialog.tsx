'use client';

import {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '../../utils';
import { Button, TextField } from '../../inputs';
import { useCreateTableDialog }
  from './useCreateTableDialog';
import { CreateTableColumnList }
  from './CreateTableColumnList';
import type { CreateTableDialogProps }
  from './createTableTypes';

export type {
  TableColumn, CreateTableDialogProps,
} from './createTableTypes';

/**
 * CreateTableDialog - Dialog for creating new
 * database tables with column definitions.
 */
export function CreateTableDialog({
  open, onClose, onCreate,
  dataTypes, testId,
}: CreateTableDialogProps) {
  const d = useCreateTableDialog();
  const handleCreate = async () => {
    d.setLoading(true);
    try {
      await onCreate(d.tableName,
        d.columns.filter((c) => c.name.trim()));
      d.reset();
      onClose();
    } finally { d.setLoading(false); }
  };
  const handleClose = () => {
    d.reset();
    onClose();
  };
  const labelId = testId
    ? `${testId}-title` : undefined;
  return (
    <Dialog open={open} onClose={handleClose}
      data-testid={testId}
      aria-labelledby={labelId}>
      <DialogTitle id={labelId}>
        Create New Table
      </DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Table Name"
          value={d.tableName}
          onChange={(e) =>
            d.setTableName(e.target.value)}
          sx={{ mt: 2, mb: 2 }} />
        <CreateTableColumnList
          columns={d.columns}
          dataTypes={dataTypes}
          onUpdate={d.updateColumn}
          onRemove={d.removeColumn}
          onAdd={d.addColumn} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreate}
          variant="contained"
          disabled={
            d.loading || !d.tableName.trim()}>
          Create Table
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTableDialog;
