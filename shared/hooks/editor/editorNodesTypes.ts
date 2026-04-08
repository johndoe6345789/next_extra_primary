/**
 * Types for useEditorNodes hook
 */

/** Editor state slice for nodes */
export interface EditorState {
  selectedNodes: Set<string>;
}

/** Root state shape */
export interface RootState {
  editor: EditorState;
}

/** Action creators for node selection */
export interface EditorActions {
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
  clearSelection: () => any;
  setSelection: (p: {
    nodes?: string[];
    edges?: string[];
  }) => any;
}

/** Return type of useEditorNodes */
export interface UseEditorNodesReturn {
  selectedNodes: Set<string>;
  selectNode: (id: string) => void;
  addNodeToSelection: (id: string) => void;
  removeNodeFromSelection: (
    id: string
  ) => void;
  toggleNodeSelection: (id: string) => void;
  clearSelection: () => void;
  setNodeSelection: (
    nodes: string[],
    edges?: string[]
  ) => void;
}

/** Options for useEditorNodes */
export interface UseEditorNodesOptions {
  actions: EditorActions;
}
