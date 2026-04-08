/**
 * Type definitions for editor state
 */

/** Editor canvas state */
export interface EditorState {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  isDrawing: boolean;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    nodeId?: string;
  };
  canvasSize: {
    width: number;
    height: number;
  };
}

/** Initial editor state */
export const editorInitialState: EditorState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedNodes: new Set(),
  selectedEdges: new Set(),
  isDrawing: false,
  contextMenu: {
    visible: false,
    x: 0,
    y: 0
  },
  canvasSize: {
    width: 0,
    height: 0
  }
};
