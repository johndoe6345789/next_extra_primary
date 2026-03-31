/**
 * @file EndpointCard.tsx
 * @brief Single endpoint display with details.
 */

'use client';

import { useState } from 'react';
import { Typography, Box } from '@metabuilder/m3';
import type { EndpointEntry } from '@/hooks/types';
import MethodChip from './MethodChip';
import ParamsTable from './ParamsTable';
import SchemaView from './SchemaView';

/** @brief Props for EndpointCard. */
interface EndpointCardProps {
  /** The endpoint entry to render. */
  entry: EndpointEntry;
}

/** @brief Extract request body schema. */
function getBodySchema(entry: EndpointEntry) {
  const body = entry.operation.requestBody;
  return body?.content?.['application/json']?.schema;
}

/**
 * @brief Expandable card for a single endpoint.
 * @param props - Component props.
 * @returns Collapsible endpoint card element.
 */
export default function EndpointCard(
  { entry }: EndpointCardProps,
) {
  const [open, setOpen] = useState(false);
  const { path, method, operation } = entry;
  const bodySchema = getBodySchema(entry);
  const params = operation.parameters ?? [];
  const secured = (operation.security?.length ?? 0)
    > 0;

  return (
    <div className="endpoint-card">
      <div
        className="endpoint-summary"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${method} ${path}`}
        data-testid="endpoint-card"
      >
        <MethodChip method={method} />
        <span className="endpoint-path">
          {path}
        </span>
        <span className="endpoint-desc">
          {operation.summary ?? ''}
          {secured ? ' (auth)' : ''}
        </span>
      </div>
      {open && (
        <Box className="endpoint-details">
          {operation.description && (
            <Typography variant="body2">
              {operation.description}
            </Typography>
          )}
          <ParamsTable params={params} />
          {bodySchema && (
            <SchemaView
              schema={bodySchema}
              label="Request Body"
            />
          )}
        </Box>
      )}
    </div>
  );
}
