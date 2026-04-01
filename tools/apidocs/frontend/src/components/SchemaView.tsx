/**
 * @file SchemaView.tsx
 * @brief Renders a JSON schema as formatted code.
 */

import { Box, Typography } from '@shared/m3';
import type { OApiSchema } from '@/hooks/types';

/** @brief Props for SchemaView. */
interface SchemaViewProps {
  /** The JSON schema object to display. */
  schema: OApiSchema;
  /** Optional label above the schema. */
  label?: string;
}

/**
 * @brief Display a JSON schema in a mono box.
 * @param props - Component props.
 * @returns Formatted schema block.
 */
export default function SchemaView(
  { schema, label }: SchemaViewProps,
) {
  const formatted = JSON.stringify(
    schema, null, 2,
  );

  return (
    <Box
      data-testid="schema-view"
      aria-label={label ?? 'JSON Schema'}
    >
      {label && (
        <Typography
          variant="subtitle2"
          style={{ marginBottom: '4px' }}
        >
          {label}
        </Typography>
      )}
      <div className="schema-box">
        {formatted}
      </div>
    </Box>
  );
}
