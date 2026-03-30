/**
 * @file SchemasPanel.tsx
 * @brief Displays all component schemas from spec.
 */

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@metabuilder/m3';
import type { OApiSchema } from '@/hooks/types';
import SchemaView from './SchemaView';

/** @brief Props for SchemasPanel. */
interface SchemasPanelProps {
  /** Map of schema name to schema object. */
  schemas: Record<string, OApiSchema>;
}

/**
 * @brief Panel listing all component schemas.
 * @param props - Component props.
 * @returns Accordion list of schemas.
 */
export default function SchemasPanel(
  { schemas }: SchemasPanelProps,
) {
  const entries = Object.entries(schemas);

  if (entries.length === 0) {
    return (
      <Typography variant="body1">
        No schemas defined.
      </Typography>
    );
  }

  return (
    <Box
      data-testid="schemas-panel"
      aria-label="API schemas"
    >
      {entries.map(([name, schema]) => (
        <Accordion key={name}>
          <AccordionSummary>
            <Typography variant="subtitle1">
              {name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SchemaView
              schema={schema}
              label={name}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
