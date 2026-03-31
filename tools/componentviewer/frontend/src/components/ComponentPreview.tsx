/**
 * Renders a live preview of the selected M3
 * component with the current prop values.
 * @module components/ComponentPreview
 */
'use client';

import { createElement } from 'react';
import {
  Box, Typography, Paper,
} from '@metabuilder/m3';
import type { ComponentDef } from '../types';
import type { PropValues } from
  '../hooks/usePropState';
import { getComponent } from '../registry';

/** Props for ComponentPreview. */
interface ComponentPreviewProps {
  /** The active component definition. */
  readonly def: ComponentDef;
  /** Current prop values to render with. */
  readonly values: PropValues;
}

/**
 * @brief Renders the component with live props.
 * @param props - Preview configuration.
 * @returns Preview JSX element.
 */
export default function ComponentPreview({
  def,
  values,
}: ComponentPreviewProps) {
  const Comp = getComponent(def.name);
  if (!Comp) {
    return (
      <Typography color="error">
        Component not found: {def.name}
      </Typography>
    );
  }

  const { children, ...rest } = values as Record<
    string,
    unknown
  >;

  return (
    <Paper
      data-testid="component-preview"
      aria-label={`Preview of ${def.name}`}
      style={{ padding: 24 }}
    >
      <Typography variant="h6" gutterBottom>
        {def.name}
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
        color="textSecondary"
      >
        {def.description}
      </Typography>
      <Box style={{ marginTop: 16 }}>
        {createElement(
          Comp,
          rest,
          children ? String(children) : undefined,
        )}
      </Box>
    </Paper>
  );
}
