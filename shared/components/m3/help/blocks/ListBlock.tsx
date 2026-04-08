import React from 'react';
import { DocContentBlock } from '../../../types/documentation';

/** Renders an unordered list block. */
export function ListBlock({
  block,
}: {
  block: DocContentBlock;
}) {
  return (
    <ul
      style={{
        marginLeft: '16px',
        marginBottom: '16px',
      }}
    >
      {block.items?.map((item, idx) => (
        <li
          key={idx}
          style={{ marginBottom: '4px' }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default ListBlock;
