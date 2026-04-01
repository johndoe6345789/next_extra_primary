/**
 * @file ParamsTable.tsx
 * @brief Renders endpoint parameters as a table.
 */

import { Typography } from '@shared/m3';
import type { OApiParam } from '@/hooks/types';

/** @brief Props for ParamsTable. */
interface ParamsTableProps {
  /** List of parameters to display. */
  params: OApiParam[];
}

/**
 * @brief Table of API parameters.
 * @param props - Component props.
 * @returns Table element with parameter rows.
 */
export default function ParamsTable(
  { params }: ParamsTableProps,
) {
  if (params.length === 0) return null;

  return (
    <div
      data-testid="params-table"
      aria-label="Parameters"
    >
      <Typography
        variant="subtitle2"
        style={{ marginBottom: '8px' }}
      >
        Parameters
      </Typography>
      <table className="params-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>In</th>
            <th>Type</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={`${p.in}-${p.name}`}>
              <td>
                <code>{p.name}</code>
              </td>
              <td>{p.in}</td>
              <td>{p.schema?.type ?? '-'}</td>
              <td>{p.required ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
