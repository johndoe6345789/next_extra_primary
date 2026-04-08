import type { MouseEvent } from 'react';
import type { WorkflowNode, NodeType, Position }
  from './types';

/** Props for the CanvasNode component. */
export interface CanvasNodeProps {
  node: WorkflowNode;
  nodeType: NodeType | undefined;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
  onDragStart: (
    e: MouseEvent, nodeId: string,
  ) => void;
  onConnectionStart: (
    nodeId: string,
    outputName: string,
    position: Position,
  ) => void;
  onConnectionEnd: (
    nodeId: string, inputName: string,
  ) => void;
  isDrawingConnection: boolean;
}
