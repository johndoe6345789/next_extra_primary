/**
 * Editor edges type definitions
 */

/** Type for the editor state slice */
export interface EditorState {
  selectedEdges: Set<string>;
}

/** Root state with editor slice */
export interface RootState {
  editor: EditorState;
}

/** Action creators for edge operations */
export interface EditorActions {
  selectEdge: (
    edgeId: string
  ) => any;
  addEdgeToSelection: (
    edgeId: string
  ) => any;
  removeEdgeFromSelection: (
    edgeId: string
  ) => any;
  clearSelection: () => any;
  setSelection: (payload: {
    nodes?: string[];
    edges?: string[];
  }) => any;
}

/** Return type of useEditorEdges */
export interface UseEditorEdgesReturn {
  selectedEdges: Set<string>;
  selectEdge: (edgeId: string) => void;
  addEdgeToSelection: (
    edgeId: string
  ) => void;
  removeEdgeFromSelection: (
    edgeId: string
  ) => void;
  clearSelection: () => void;
  setEdgeSelection: (
    edges: string[],
    nodes?: string[]
  ) => void;
}

/** Options for useEditorEdges */
export interface UseEditorEdgesOptions {
  actions: EditorActions;
}
