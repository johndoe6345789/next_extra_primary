/**
 * Renders all defined variants of a component
 * in a responsive grid layout.
 * @module components/VariantGrid
 */
'use client';

import { createElement } from 'react';
import {
  Typography, Paper, Box,
} from '@shared/m3';
import type { ComponentDef } from '../types';
import { getComponent } from '../registry';

/** Props for VariantGrid. */
interface VariantGridProps {
  /** The component definition with variants. */
  readonly def: ComponentDef;
}

/**
 * @brief Shows all variants in a grid.
 * @param props - Grid configuration.
 * @returns Grid JSX element.
 */
export default function VariantGrid({
  def,
}: VariantGridProps) {
  const Comp = getComponent(def.name);
  if (!Comp || !def.variants.length) return null;

  return (
    <Box
      data-testid="variant-grid"
      aria-label={`Variants of ${def.name}`}
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        marginTop: 16,
      }}
    >
      {def.variants.map((v) => {
        const { children, ...rest } = v.props as
          Record<string, unknown>;
        return (
          <Paper
            key={v.label}
            style={{ padding: 16, textAlign: 'center' }}
          >
            <Typography
              variant="caption"
              gutterBottom
            >
              {v.label}
            </Typography>
            <Box style={{ marginTop: 8 }}>
              {createElement(
                Comp,
                rest,
                children
                  ? String(children)
                  : undefined,
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
