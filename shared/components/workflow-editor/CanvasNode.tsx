/**
 * CanvasNode - renders a workflow node
 * on the canvas.
 */

'use client';

import React, { type MouseEvent }
  from 'react';
import type { CanvasNodeProps }
  from './canvasNodeTypes';
import { InputPorts, OutputPorts }
  from './CanvasPorts';
import { CanvasNodeHeader }
  from './CanvasNodeHeader';
import styles
  from '../../scss/atoms/workflow-editor.module.scss';

export type { CanvasNodeProps }
  from './canvasNodeTypes';

/** Renders a single workflow node. */
export function CanvasNode({
  node, nodeType, isSelected,
  onSelect, onDoubleClick, onDragStart,
  onConnectionStart, onConnectionEnd,
  isDrawingConnection,
}: CanvasNodeProps): React.ReactElement {
  const color = nodeType?.color || '#666';
  return (
    <div
      onClick={() => onSelect(node.id)}
      onDoubleClick={() =>
        onDoubleClick(node.id)}
      onMouseDown={(
        e: MouseEvent<HTMLDivElement>,
      ) => {
        const t = e.target as HTMLElement;
        if (t.classList.contains(
          styles.outputPort)
          || t.classList.contains(
            styles.inputPort)) return;
        onDragStart(e, node.id);
      }}
      className={
        `${styles.canvasNode} ${isSelected ? styles.selected : ''}`
      }
      style={{
        left: node.position.x,
        top: node.position.y,
      }}>
      <CanvasNodeHeader name={node.name}
        color={color}
        icon={nodeType?.icon} />
      <div className={styles.canvasNodeBody}>
        <p className={styles.canvasNodeDesc}>
          {nodeType?.description
            || 'Custom node'}
        </p>
      </div>
      <InputPorts inputs={node.inputs}
        color={color}
        isDrawingConnection={
          isDrawingConnection}
        nodeId={node.id}
        onConnectionEnd={onConnectionEnd} />
      <OutputPorts outputs={node.outputs}
        color={color} nodeId={node.id}
        nodeX={node.position.x}
        nodeY={node.position.y}
        onConnectionStart={
          onConnectionStart} />
    </div>
  );
}
