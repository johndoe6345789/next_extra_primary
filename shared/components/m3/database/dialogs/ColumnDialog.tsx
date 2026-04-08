'use client';

import {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '../../utils';
import { Button } from '../../inputs';
import { useColumnDialog }
  from './useColumnDialog';
import { ColumnDialogContent }
  from './ColumnDialogContent';
import {
  getColumnDialogTitle, isColumnFormValid,
  getColumnSubmitLabel,
} from './columnDialogHelpers';
import type {
  ColumnInfo, ColumnDialogMode,
  ColumnDialogProps,
} from './columnDialogTypes';

export type { ColumnInfo, ColumnDialogMode,
  ColumnDialogProps } from './columnDialogTypes';

/**
 * ColumnDialog - Dialog for managing columns.
 * Supports adding, modifying, and dropping.
 */
export function ColumnDialog({
  open, mode, tableName, columns = [],
  onClose, onSubmit, dataTypes, testId,
}: ColumnDialogProps) {
  const d = useColumnDialog(open);
  const handleSubmit = async () => {
    d.setLoading(true);
    try {
      const data: Record<string, unknown> = {};
      if (mode === 'add') {
        data.columnName = d.columnName;
        data.dataType = d.columnType;
        data.nullable = d.nullable;
        if (d.defaultValue)
          data.defaultValue = d.defaultValue;
      } else if (mode === 'modify') {
        data.columnName = d.selectedColumn;
        data.newType = d.columnType;
        data.nullable = d.nullable;
      } else {
        data.columnName = d.selectedColumn;
      }
      await onSubmit(data);
      onClose();
    } finally { d.setLoading(false); }
  };
  const labelId = testId
    ? `${testId}-title` : undefined;
  return (
    <Dialog open={open} onClose={onClose}
      data-testid={testId}
      aria-labelledby={labelId}>
      <DialogTitle id={labelId}>
        {getColumnDialogTitle(mode, tableName)}
      </DialogTitle>
      <DialogContent>
        <ColumnDialogContent
          mode={mode} columns={columns}
          {...d} dataTypes={dataTypes} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}
          variant="contained"
          color={mode === 'drop'
            ? 'error' : 'primary'}
          disabled={d.loading || !isColumnFormValid(
            mode, d.columnName,
            d.columnType, d.selectedColumn)}>
          {getColumnSubmitLabel(mode)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColumnDialog;
