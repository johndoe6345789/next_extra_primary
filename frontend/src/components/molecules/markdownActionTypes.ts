/**
 * Shared types for the markdown editor's
 * wrap/unwrap/toggle logic.
 */

/** A single formatting button definition. */
export interface MdAction {
  label: string;
  /** Marker before selection. */
  prefix: string;
  /** Marker after selection. Omit for line actions. */
  suffix?: string;
  /** Toggle this prefix at the start of each line in
   *  the selection (lists, quotes) instead of
   *  wrapping the selection. */
  linePrefix?: boolean;
}

/** Options that override the default smart toggle
 *  behaviour — used when the user has explicitly
 *  chosen one branch of an ambiguous case via the
 *  MarkdownActionDialog. */
export interface MdActionOptions {
  /** Skip the auto-wrap-current-line shortcut for
   *  block markers, even when content exists.
   *  Result is always an empty block at the cursor
   *  with newline padding as needed. */
  forceInsert?: boolean;
}

/** Result of an action: new full text and caret. */
export interface MdActionResult {
  value: string;
  caretStart: number;
  caretEnd: number;
}

/** Reading frame extracted from the textarea —
 *  passed between the various apply* helpers. */
export interface MdState {
  before: string;
  sel: string;
  after: string;
  ss: number;
  se: number;
}

/** Read the current state out of a textarea. */
export function readMdState(
  el: HTMLTextAreaElement,
): MdState {
  const { selectionStart: ss, selectionEnd: se,
    value } = el;
  return {
    before: value.slice(0, ss),
    sel: value.slice(ss, se),
    after: value.slice(se),
    ss, se,
  };
}
