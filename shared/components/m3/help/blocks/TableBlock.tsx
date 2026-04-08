import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

const CELL: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #e0e0e0',
};

/** Renders a data table block. */
export function TableBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <table
      style={{
        marginBottom: '16px',
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #e0e0e0',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {block.columns?.map((col) => (
            <th
              key={col}
              style={{
                ...CELL,
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows?.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, ci) => (
              <td key={ci} style={CELL}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableBlock;
