/**
 * Individual control renderers for PropEditor.
 * @module components/PropEditorControls
 */
'use client';

import {
  TextField, Checkbox, Select,
  FormControlLabel,
} from '@shared/m3';
import type { PropDef } from '../types';
import type { PropValues } from
  '../hooks/usePropState';

interface ControlProps {
  /** Prop definition. */
  readonly p: PropDef;
  /** Current values map. */
  readonly values: PropValues;
  /** Change handler. */
  readonly onChange: (
    name: string,
    value: string | boolean | number,
  ) => void;
}

/**
 * Renders one boolean checkbox control.
 * @param props - Control configuration.
 */
export function BoolControl({
  p, values, onChange,
}: ControlProps) {
  const val = (values[p.name] ?? p.defaultValue) as boolean;
  return (
    <FormControlLabel
      key={p.name}
      label={p.name}
      control={
        <Checkbox
          checked={val}
          onChange={e =>
            onChange(p.name, e.target.checked)
          }
        />
      }
    />
  );
}

/**
 * Renders one enum select control.
 * @param props - Control configuration.
 */
export function EnumControl({
  p, values, onChange,
}: ControlProps) {
  const val = String(values[p.name] ?? p.defaultValue);
  return (
    <Select
      key={p.name}
      label={p.name}
      value={val}
      onChange={e => onChange(p.name, e.target.value)}
      options={(p.options ?? []).map(o => ({
        label: o, value: o,
      }))}
      aria-label={p.name}
    />
  );
}

/**
 * Renders one text or number field control.
 * @param props - Control configuration.
 */
export function TextControl({
  p, values, onChange,
}: ControlProps) {
  const val = String(values[p.name] ?? p.defaultValue);
  return (
    <TextField
      key={p.name}
      label={p.name}
      value={val}
      type={p.type === 'number' ? 'number' : 'text'}
      size="small"
      onChange={e =>
        onChange(
          p.name,
          p.type === 'number'
            ? Number(e.target.value)
            : e.target.value,
        )
      }
    />
  );
}
