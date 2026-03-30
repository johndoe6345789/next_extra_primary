/**
 * Form that generates prop controls based on
 * definition types: text, checkbox, select.
 * @module components/PropEditor
 */
'use client';

import {
  TextField, Checkbox, Select,
  FormControlLabel, Typography, Stack,
} from '@metabuilder/m3';
import type { PropDef } from '../types';
import type { PropValues } from
  '../hooks/usePropState';

/** Props for PropEditor. */
interface PropEditorProps {
  /** Prop definitions to render controls for. */
  readonly propDefs: readonly PropDef[];
  /** Current prop values. */
  readonly values: PropValues;
  /** Called when a prop value changes. */
  readonly onChange: (
    name: string,
    value: string | boolean | number,
  ) => void;
}

/**
 * @brief Renders editable controls per prop.
 * @param props - Editor configuration.
 * @returns Form JSX element.
 */
export default function PropEditor({
  propDefs,
  values,
  onChange,
}: PropEditorProps) {
  return (
    <Stack
      data-testid="prop-editor"
      aria-label="Prop editor"
      style={{ gap: 12, padding: 16 }}
    >
      <Typography variant="subtitle1">
        Props
      </Typography>
      {propDefs.map((p) => {
        const val = values[p.name] ?? p.defaultValue;
        if (p.type === 'boolean') {
          return (
            <FormControlLabel
              key={p.name}
              label={p.name}
              control={
                <Checkbox
                  checked={val as boolean}
                  onChange={(e) =>
                    onChange(p.name, e.target.checked)
                  }
                />
              }
            />
          );
        }
        if (p.type === 'enum' && p.options) {
          return (
            <Select
              key={p.name}
              label={p.name}
              value={String(val)}
              onChange={(e) =>
                onChange(p.name, e.target.value)
              }
              options={p.options.map((o) => ({
                label: o,
                value: o,
              }))}
              aria-label={p.name}
            />
          );
        }
        return (
          <TextField
            key={p.name}
            label={p.name}
            value={String(val)}
            type={p.type === 'number' ? 'number' : 'text'}
            size="small"
            onChange={(e) =>
              onChange(
                p.name,
                p.type === 'number'
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        );
      })}
    </Stack>
  );
}
