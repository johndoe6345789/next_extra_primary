/**
 * CanvasPorts - Input/Output port rendering
 * for workflow canvas nodes
 */

'use client';

import React from 'react';
import styles
  from '../../scss/atoms/workflow-editor.module.scss';

/** Props for the InputPorts component. */
export interface InputPortProps {
  inputs: string[];
  color: string;
  isDrawingConnection: boolean;
  nodeId: string;
  onConnectionEnd: (
    nodeId: string, inputName: string,
  ) => void;
}

/** Renders input ports on a canvas node. */
export function InputPorts({
  inputs, color, isDrawingConnection,
  nodeId, onConnectionEnd,
}: InputPortProps) {
  return (
    <>
      {inputs.map((input, idx) => (
        <div
          key={`input-${input}`}
          className={styles.inputPort}
          style={{
            top: 80 + idx * 24,
            borderColor: color,
            cursor: isDrawingConnection
              ? 'crosshair' : 'default',
            transform: isDrawingConnection
              ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.15s ease',
          }}
          title={`Input: ${input}`}
          onMouseUp={() => {
            if (isDrawingConnection) {
              onConnectionEnd(nodeId, input);
            }
          }}
        />
      ))}
    </>
  );
}

export {
  OutputPorts, type OutputPortProps,
} from './OutputPorts';
