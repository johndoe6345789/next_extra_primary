'use client';

import { TextField, Select }
  from '../../inputs';
import type { ConstraintAddFormProps }
  from './constraintAddFormTypes';

export type { ConstraintAddFormProps }
  from './constraintAddFormTypes';

/** Form fields for adding a constraint. */
export function ConstraintAddForm({
  constraintName, onConstraintNameChange,
  constraintType, onConstraintTypeChange,
  constraintTypes,
  columnName, onColumnNameChange,
  checkExpression, onCheckExpressionChange,
  currentType,
}: ConstraintAddFormProps) {
  return (
    <>
      <TextField fullWidth
        label="Constraint Name"
        value={constraintName}
        onChange={(e) =>
          onConstraintNameChange(
            e.target.value)}
        sx={{ mt: 2, mb: 2 }}
        helperText={
          'A unique name for this constraint'
        } />
      <Select fullWidth
        value={constraintType}
        onChange={(e) =>
          onConstraintTypeChange(
            e.target.value as string)}
        sx={{ mb: 2 }}>
        {constraintTypes.map((type) => (
          <option key={type.name}
            value={type.name}>
            {type.name} - {type.description}
          </option>
        ))}
      </Select>
      {currentType?.requiresColumn && (
        <TextField fullWidth
          label="Column Name"
          value={columnName}
          onChange={(e) =>
            onColumnNameChange(
              e.target.value)}
          sx={{ mb: 2 }}
          helperText={
            'The column for this constraint'
          } />
      )}
      {currentType?.requiresExpression && (
        <TextField fullWidth
          label="Check Expression"
          value={checkExpression}
          onChange={(e) =>
            onCheckExpressionChange(
              e.target.value)}
          sx={{ mb: 2 }}
          helperText={
            'Boolean expression (e.g., price > 0)'
          } />
      )}
    </>
  );
}

export default ConstraintAddForm;
