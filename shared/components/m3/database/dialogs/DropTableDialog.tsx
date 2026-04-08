'use client';

import { useState } from 'react';
import {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '../../utils';
import { Typography }
  from '../../data-display';
import { Button, Select } from '../../inputs';
import type { DropTableDialogProps }
  from './dropTableTypes';

export type {
  TableInfo, DropTableDialogProps,
} from './dropTableTypes';

/**
 * DropTableDialog - Dialog for dropping
 * database tables with a warning.
 */
export function DropTableDialog({
  open, tables, onClose, onDrop, testId,
}: DropTableDialogProps) {
  const [selectedTable, setSelectedTable] =
    useState('');
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setSelectedTable(''); onClose();
  };
  const handleDrop = async () => {
    if (!selectedTable) return;
    setLoading(true);
    try {
      await onDrop(selectedTable);
      handleClose();
    } finally { setLoading(false); }
  };
  const labelId = testId
    ? `${testId}-title` : undefined;
  return (
    <Dialog open={open}
      onClose={handleClose}
      data-testid={testId}
      role="alertdialog"
      aria-labelledby={labelId}>
      <DialogTitle id={labelId}>
        Drop Table
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2"
          color="error" gutterBottom>
          Warning: This will permanently
          delete the table and all its data!
        </Typography>
        <Select fullWidth
          value={selectedTable}
          onChange={(e) =>
            setSelectedTable(
              e.target.value as string)}
          displayEmpty sx={{ mt: 2 }}>
          <option value="">
            <em>Select a table to drop</em>
          </option>
          {tables.map((t) => (
            <option key={t.table_name}
              value={t.table_name}>
              {t.table_name}
            </option>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleDrop}
          color="error" variant="contained"
          disabled={
            loading || !selectedTable
          }>
          Drop Table
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DropTableDialog;
