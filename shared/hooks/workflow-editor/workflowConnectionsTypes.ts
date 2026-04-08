/**
 * Types for useWorkflowConnections
 */

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourceOutput: string;
  targetNodeId: string;
  targetInput: string;
}

export interface DrawingConnection {
  sourceNodeId: string;
  sourceOutput: string;
  startPosition: Position;
  currentPosition: Position;
}

export interface UseWorkflowConnectionsReturn {
  connections: Connection[];
  drawingConnection: DrawingConnection | null;
  isDrawing: boolean;
  addConnection: (c: Connection) => boolean;
  removeConnection: (id: string) => void;
  removeConnectionByEndpoints: (
    srcId: string,
    tgtId: string
  ) => void;
  setConnections: (c: Connection[]) => void;
  startDrawing: (
    srcId: string,
    srcOut: string,
    pos: Position
  ) => void;
  updateDrawing: (pos: Position) => void;
  endDrawing: () => void;
  cancelDrawing: () => void;
  completeConnection: (
    tgtId: string,
    tgtInput: string
  ) => boolean;
  getNodeConnections: (
    id: string
  ) => Connection[];
  getOutgoingConnections: (
    id: string
  ) => Connection[];
  getIncomingConnections: (
    id: string
  ) => Connection[];
  hasConnection: (
    srcId: string,
    srcOut: string,
    tgtId: string,
    tgtIn: string
  ) => boolean;
  removeNodeConnections: (id: string) => void;
}

export interface UseWorkflowConnectionsOptions {
  initialConnections?: Connection[];
  onConnectionsChange?: (
    c: Connection[]
  ) => void;
  generateConnectionId?: () => string;
}
