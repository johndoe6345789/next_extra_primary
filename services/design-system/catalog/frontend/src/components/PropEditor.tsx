/**
 * Form that generates prop controls based on
 * definition types: text, checkbox, select.
 * @module components/PropEditor
 */
'use client';

import { Typography, Stack } from '@shared/m3';
import type { PropDef } from '../types';
import type { PropValues } from
  '../hooks/usePropState';
import {
  BoolControl,
  EnumControl,
  TextControl,
} from './PropEditorControls';

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
 * Renders editable controls per prop.
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
      <Typography variant="subtitle1">Props</Typography>
      {propDefs.map((p) => {
        if (p.type === 'boolean')
          return (
            <BoolControl
              key={p.name}
              p={p} values={values}
              onChange={onChange}
            />
          );
        if (p.type === 'enum' && p.options)
          return (
            <EnumControl
              key={p.name}
              p={p} values={values}
              onChange={onChange}
            />
          );
        return (
          <TextControl
            key={p.name}
            p={p} values={values}
            onChange={onChange}
          />
        );
      })}
    </Stack>
  );
}
