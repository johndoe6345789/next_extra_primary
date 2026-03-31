/**
 * @file MethodChip.tsx
 * @brief Colored HTTP method badge using M3 Chip.
 */

import { Chip } from '@metabuilder/m3';
import type { HttpMethod } from '@/hooks/types';

/** @brief Color map for HTTP methods. */
const METHOD_COLORS: Record<HttpMethod, string> = {
  get: '#2e7d32',
  post: '#1565c0',
  put: '#e65100',
  patch: '#f57f17',
  delete: '#c62828',
};

/** @brief Props for MethodChip. */
interface MethodChipProps {
  /** HTTP method to display. */
  method: HttpMethod;
}

/**
 * @brief Chip showing the HTTP method with color.
 * @param props - Component props.
 * @returns Colored method chip element.
 */
export default function MethodChip(
  { method }: MethodChipProps,
) {
  const color = METHOD_COLORS[method];
  const label = method.toUpperCase();

  return (
    <Chip
      label={label}
      data-testid={`method-chip-${method}`}
      aria-label={`HTTP ${label} method`}
      style={{
        backgroundColor: color,
        color: '#fff',
        fontWeight: 600,
        fontSize: '12px',
        minWidth: '64px',
        textAlign: 'center',
      }}
    />
  );
}
