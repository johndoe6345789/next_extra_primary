/**
 * @file InfoPanel.tsx
 * @brief Displays the OpenAPI info and servers.
 */

import {
  Typography,
  Box,
  Chip,
} from '@metabuilder/m3';
import type { OpenApiSpec } from '@/hooks/types';

/** @brief Props for InfoPanel. */
interface InfoPanelProps {
  /** The parsed OpenAPI spec. */
  spec: OpenApiSpec;
}

/**
 * @brief Panel showing API info and servers.
 * @param props - Component props.
 * @returns Info panel element.
 */
export default function InfoPanel(
  { spec }: InfoPanelProps,
) {
  const { info, servers } = spec;

  return (
    <Box
      data-testid="info-panel"
      aria-label="API information"
    >
      <Typography variant="h4">
        {info.title}
      </Typography>
      <Chip
        label={`v${info.version}`}
        style={{ marginTop: '8px' }}
        data-testid="version-chip"
        aria-label={`Version ${info.version}`}
      />
      {info.description && (
        <Typography
          variant="body1"
          style={{ marginTop: '16px' }}
        >
          {info.description}
        </Typography>
      )}
      {servers && servers.length > 0 && (
        <Box style={{ marginTop: '16px' }}>
          <Typography variant="subtitle2">
            Servers
          </Typography>
          {servers.map((s) => (
            <Typography
              key={s.url}
              variant="body2"
              style={{
                fontFamily: 'monospace',
                marginTop: '4px',
              }}
            >
              {s.url}
              {s.description
                ? ` - ${s.description}` : ''}
            </Typography>
          ))}
        </Box>
      )}
      <Box style={{ marginTop: '16px' }}>
        <Typography variant="subtitle2">
          Spec Version
        </Typography>
        <Typography variant="body2">
          OpenAPI {spec.openapi}
        </Typography>
      </Box>
    </Box>
  );
}
