'use client';

import {
  TextField,
  Select,
  Checkbox,
  FormControlLabel,
} from '../../inputs';

/** Props for the add-column form fields. */
export interface ColumnDialogAddFormProps {
  columnName: string;
  onColumnNameChange: (v: string) => void;
  columnType: string;
  onColumnTypeChange: (v: string) => void;
  nullable: boolean;
  onNullableChange: (v: boolean) => void;
  defaultValue: string;
  onDefaultValueChange: (v: string) => void;
  dataTypes: string[];
}

/**
 * Form fields for adding a new column.
 */
export function ColumnDialogAddForm({
  columnName,
  onColumnNameChange,
  columnType,
  onColumnTypeChange,
  nullable,
  onNullableChange,
  defaultValue,
  onDefaultValueChange,
  dataTypes,
}: ColumnDialogAddFormProps) {
  return (
    <>
      <TextField
        fullWidth
        label="Column Name"
        value={columnName}
        onChange={(e) =>
          onColumnNameChange(e.target.value)
        }
        sx={{ mt: 2, mb: 2 }}
      />
      <Select
        fullWidth
        value={columnType}
        onChange={(e) =>
          onColumnTypeChange(
            e.target.value as string
          )
        }
        sx={{ mb: 2 }}
      >
        {dataTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <FormControlLabel
        control={
          <Checkbox
            checked={nullable}
            onChange={(e) =>
              onNullableChange(e.target.checked)
            }
          />
        }
        label="Nullable"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Default Value (optional)"
        value={defaultValue}
        onChange={(e) =>
          onDefaultValueChange(e.target.value)
        }
      />
    </>
  );
}

export default ColumnDialogAddForm;
