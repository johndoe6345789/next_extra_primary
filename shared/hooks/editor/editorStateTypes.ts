/**
 * Editor Redux state and action types
 */

/** Editor Redux state slice */
export interface EditorState {
  zoom: number;
  pan: { x: number; y: number };
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  isDrawing: boolean;
  contextMenu: unknown;
  canvasSize: {
    width: number;
    height: number;
  };
}

/** Root Redux state shape */
export interface RootState {
  editor: EditorState;
}

/** Editor action creators */
export interface EditorActions {
  setZoom: (zoom: number) => any;
  zoomIn: () => any;
  zoomOut: () => any;
  resetZoom: () => any;
  setPan: (p: {
    x: number;
    y: number;
  }) => any;
  panBy: (p: {
    dx: number;
    dy: number;
  }) => any;
  resetPan: () => any;
  selectNode: (id: string) => any;
  addNodeToSelection: (
    id: string
  ) => any;
  removeNodeFromSelection: (
    id: string
  ) => any;
  toggleNodeSelection: (
    id: string
  ) => any;
  selectEdge: (id: string) => any;
  addEdgeToSelection: (
    id: string
  ) => any;
  removeEdgeFromSelection: (
    id: string
  ) => any;
  clearSelection: () => any;
  setSelection: (p: {
    nodes?: string[];
    edges?: string[];
  }) => any;
  setDrawing: (d: boolean) => any;
  showContextMenu: (p: {
    x: number;
    y: number;
    nodeId?: string;
  }) => any;
  hideContextMenu: () => any;
  setCanvasSize: (p: {
    width: number;
    height: number;
  }) => any;
  resetEditor: () => any;
}

/** Options for useEditor */
export interface UseEditorOptions {
  actions: EditorActions;
}
