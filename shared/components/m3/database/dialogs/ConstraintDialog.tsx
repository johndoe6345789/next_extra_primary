'use client';

import {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '../../utils';
import { Button } from '../../inputs';
import { useConstraintDialog }
  from './useConstraintDialog';
import { isConstraintFormValid }
  from './constraintDialogHelpers';
import { ConstraintDialogContent }
  from './ConstraintDialogContent';
import { buildConstraintPayload }
  from './constraintSubmit';
import type { ConstraintDialogProps }
  from './constraintDialogTypes';

export type {
  ConstraintType, ConstraintInfo,
  ConstraintDialogMode,
  ConstraintDialogProps,
} from './constraintDialogTypes';

/**
 * ConstraintDialog - Dialog for managing
 * database constraints. Supports add/delete.
 */
export function ConstraintDialog({
  open, mode, constraintTypes,
  selectedConstraint, onClose,
  onSubmit, testId,
}: ConstraintDialogProps) {
  const d = useConstraintDialog(
    open, constraintTypes);
  const handleSubmit = async () => {
    d.setLoading(true);
    try {
      if (mode === 'add') {
        await onSubmit(buildConstraintPayload(
          d.constraintName, d.constraintType,
          d.currentType, d.columnName,
          d.checkExpression));
      } else { await onSubmit({}); }
      onClose();
    } finally { d.setLoading(false); }
  };
  const title = mode === 'add'
    ? 'Add Constraint'
    : `Delete: ${selectedConstraint?.constraint_name}`;
  const labelId = testId
    ? `${testId}-title` : undefined;
  const valid = isConstraintFormValid(
    mode, d.constraintName,
    d.constraintType, d.currentType,
    d.columnName, d.checkExpression);
  return (
    <Dialog open={open} onClose={onClose}
      data-testid={testId}
      aria-labelledby={labelId}>
      <DialogTitle id={labelId}>
        {title}
      </DialogTitle>
      <DialogContent>
        <ConstraintDialogContent
          mode={mode}
          selectedConstraint={
            selectedConstraint}
          {...d}
          constraintTypes={constraintTypes} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}
          variant="contained"
          color={mode === 'delete'
            ? 'error' : 'primary'}
          disabled={d.loading || !valid}>
          {mode === 'add'
            ? 'Add' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConstraintDialog;
