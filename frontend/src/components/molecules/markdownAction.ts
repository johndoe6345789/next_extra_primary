/**
 * Smart "wrap / unwrap / toggle" logic for the
 * markdown editor toolbar. Mirrors how GitHub,
 * Slack, and Discord handle Cmd+B style buttons:
 *
 *   - empty selection      → insert prefix+suffix
 *                            and place caret between
 *                            them (user can type
 *                            bold content next)
 *   - selection wrapped    → unwrap (toggle off)
 *   - cursor inside wrap   → unwrap (toggle off)
 *   - selection unwrapped  → wrap, leave it selected
 *
 * Line-prefix actions (lists, quotes) toggle the
 * prefix on every selected line.
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

/** Result of an action: new full text and caret. */
export interface MdActionResult {
  value: string;
  caretStart: number;
  caretEnd: number;
}

interface State {
  before: string;
  sel: string;
  after: string;
  ss: number;
  se: number;
}

function read(el: HTMLTextAreaElement): State {
  const { selectionStart: ss, selectionEnd: se,
    value } = el;
  return {
    before: value.slice(0, ss),
    sel: value.slice(ss, se),
    after: value.slice(se),
    ss, se,
  };
}

/** Toggle a line-prefix on each line covered by the
 *  selection (or the current line if no selection). */
function applyLinePrefix(
  s: State, prefix: string,
): MdActionResult {
  const lineStart = s.before.lastIndexOf('\n') + 1;
  const block = s.before.slice(lineStart) + s.sel;
  const lines = block.split('\n');
  const allHave = lines.every(
    (l) => l.startsWith(prefix),
  );
  const next = lines
    .map((l) => allHave
      ? l.slice(prefix.length)
      : prefix + l)
    .join('\n');
  const head = s.before.slice(0, lineStart);
  const delta = (allHave ? -1 : 1)
    * prefix.length * lines.length;
  return {
    value: head + next + s.after,
    caretStart: lineStart + (allHave
      ? Math.max(0, s.ss - lineStart - prefix.length)
      : (s.ss - lineStart) + prefix.length),
    caretEnd: s.se + delta,
  };
}

/** Handle inline wrap actions (B, I, code, etc.). */
function applyWrap(
  s: State, prefix: string, suffix: string,
): MdActionResult {
  const px = prefix.length;
  const sx = suffix.length;
  // Selection already wrapped → unwrap.
  if (
    s.sel.length >= px + sx
    && s.sel.startsWith(prefix)
    && s.sel.endsWith(suffix)
  ) {
    const inner = s.sel.slice(px, s.sel.length - sx);
    return {
      value: s.before + inner + s.after,
      caretStart: s.before.length,
      caretEnd: s.before.length + inner.length,
    };
  }
  // Cursor between matching markers (no selection)
  // → unwrap them.
  if (
    !s.sel
    && s.before.endsWith(prefix)
    && s.after.startsWith(suffix)
  ) {
    return {
      value: s.before.slice(0, -px)
        + s.after.slice(sx),
      caretStart: s.before.length - px,
      caretEnd: s.before.length - px,
    };
  }
  // No selection → insert markers, caret between.
  if (!s.sel) {
    const c = s.before.length + px;
    return {
      value: s.before + prefix + suffix + s.after,
      caretStart: c,
      caretEnd: c,
    };
  }
  // Plain wrap — leave inner text selected so the
  // user can type to replace or chain another action.
  return {
    value: s.before + prefix + s.sel + suffix
      + s.after,
    caretStart: s.before.length + px,
    caretEnd: s.before.length + px + s.sel.length,
  };
}

/** Apply an MdAction to the textarea state. */
export function applyMdAction(
  el: HTMLTextAreaElement, a: MdAction,
): MdActionResult {
  const s = read(el);
  if (a.linePrefix) {
    return applyLinePrefix(s, a.prefix);
  }
  return applyWrap(s, a.prefix, a.suffix ?? a.prefix);
}
