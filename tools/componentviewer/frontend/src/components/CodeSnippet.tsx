/**
 * Shows the JSX/JSON code for the current
 * component configuration.
 * @module components/CodeSnippet
 */
'use client';

import { useMemo } from 'react';
import { Typography, Paper } from '@metabuilder/m3';
import type { ComponentDef } from '../types';
import type { PropValues } from
  '../hooks/usePropState';

/** Props for CodeSnippet. */
interface CodeSnippetProps {
  /** Active component definition. */
  readonly def: ComponentDef;
  /** Current prop values. */
  readonly values: PropValues;
}

/** Builds a JSX string from props. */
function buildJsx(
  name: string,
  vals: PropValues,
): string {
  const entries = Object.entries(vals);
  const childVal = vals['children'];
  const attrs = entries
    .filter(([k]) => k !== 'children')
    .filter(([, v]) => v !== '' && v !== false)
    .map(([k, v]) => {
      if (v === true) return k;
      if (typeof v === 'number') return `${k}={${v}}`;
      return `${k}="${v}"`;
    });

  const open = [name, ...attrs].join(' ');
  if (childVal) {
    return `<${open}>${String(childVal)}</${name}>`;
  }
  return `<${open} />`;
}

/**
 * @brief Renders formatted JSX code.
 * @param props - Snippet configuration.
 * @returns Code block JSX element.
 */
export default function CodeSnippet({
  def,
  values,
}: CodeSnippetProps) {
  const code = useMemo(
    () => buildJsx(def.name, values),
    [def.name, values],
  );

  return (
    <Paper
      data-testid="code-snippet"
      aria-label="Code snippet"
      style={{ padding: 16, marginTop: 16 }}
    >
      <Typography variant="subtitle2" gutterBottom>
        JSX
      </Typography>
      <pre
        style={{
          margin: 0,
          fontSize: 13,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <code>{code}</code>
      </pre>
    </Paper>
  );
}
