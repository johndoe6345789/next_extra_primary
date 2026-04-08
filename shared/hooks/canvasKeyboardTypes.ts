/**
 * Type definitions for useCanvasKeyboard
 */

/** Keyboard event handlers for canvas */
export interface KeyboardHandlers {
  onSelectAll?: () => void;
  onDeleteSelected?: () => void;
  onDuplicateSelected?: () => void;
  onSearch?: () => void;
}

/** Options for useCanvasKeyboard */
export interface UseCanvasKeyboardOptions {
  /** Dispatch function (e.g. useDispatch) */
  dispatch: (action: unknown) => void;
  /** Currently selected item IDs */
  selectedItemIds: Set<string>;
  /** Action creator for clearing selection */
  clearSelectionAction: () => {
    type: string;
    payload?: unknown;
  };
}
