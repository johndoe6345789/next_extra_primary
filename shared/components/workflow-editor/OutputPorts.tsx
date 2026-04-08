/**
 * OutputPorts - Output port rendering
 * for workflow canvas nodes.
 */

'use client';

import React, { type MouseEvent } from 'react';
import type { Position } from './types';
import styles
  from '../../scss/atoms/workflow-editor.module.scss';

/** Props for the OutputPorts component. */
export interface OutputPortProps {
  outputs: string[];
  color: string;
  nodeId: string;
  nodeX: number;
  nodeY: number;
  onConnectionStart: (
    nodeId: string,
    outputName: string,
    position: Position,
  ) => void;
}

/** Renders output ports on a canvas node. */
export function OutputPorts({
  outputs, color, nodeId,
  nodeX, nodeY, onConnectionStart,
}: OutputPortProps) {
  return (
    <>
      {outputs.map((output, idx) => (
        <div
          key={`output-${output}`}
          className={styles.outputPort}
          onMouseDown={(
            e: MouseEvent<HTMLDivElement>,
          ) => {
            e.stopPropagation();
            onConnectionStart(nodeId, output, {
              x: nodeX + 200 + 8,
              y: nodeY + 80 + idx * 24 + 8,
            });
          }}
          style={{
            top: 80 + idx * 24,
            backgroundColor: color,
            color,
          }}
          title={`Output: ${output}`}
        />
      ))}
    </>
  );
}
