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
 *  selection (or the current line if no selection).
 *
 *  - If EVERY selected line already has the prefix
 *    → strip from each (unwrap).
 *  - Otherwise, ADD the prefix to lines that lack
 *    it; LEAVE lines that already have it alone
 *    (so a partially-prefixed selection becomes
 *    fully-prefixed instead of doubling the prefix
 *    on the lines that already had it). */
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
    .map((l) => {
      if (allHave) return l.slice(prefix.length);
      // Add only if missing — never double up.
      return l.startsWith(prefix) ? l : prefix + l;
    })
    .join('\n');
  const head = s.before.slice(0, lineStart);
  return {
    value: head + next + s.after,
    caretStart: lineStart,
    caretEnd: lineStart + next.length,
  };
}

/** Handle inline wrap actions (B, I, code, etc.). */
function applyWrap(
  s: State, prefix: string, suffix: string,
  options: MdActionOptions = {},
): MdActionResult {
  const px = prefix.length;
  const sx = suffix.length;
  // Selection itself already wrapped → unwrap.
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
  // Selection sits *inside* existing markers (e.g.
  // re-clicking B with "hi" selected when text is
  // already "**hi**"). Strip the surrounding pair —
  // this is what stops repeated clicks producing
  // ******hi******.
  if (
    s.before.endsWith(prefix)
    && s.after.startsWith(suffix)
  ) {
    const newBefore = s.before.slice(0, -px);
    const newAfter = s.after.slice(sx);
    return {
      value: newBefore + s.sel + newAfter,
      caretStart: newBefore.length,
      caretEnd: newBefore.length + s.sel.length,
    };
  }
  // Wider unwrap for BLOCK markers (anything whose
  // prefix contains a newline, e.g. fenced code).
  // Cursor / selection sits INSIDE an existing block
  // even if there's text between it and each fence
  // (e.g. "```\nhello|\n```" with caret on "|"):
  // toggle the whole block off. Restricted to block
  // markers because for inline ones the same scan
  // would happily pair an unrelated closing marker
  // earlier in the line with an unrelated opening
  // marker later, mangling the document.
  if (prefix.includes('\n')) {
    const openIdx = s.before.lastIndexOf(prefix);
    const closeIdx = s.after.indexOf(suffix);
    if (openIdx >= 0 && closeIdx >= 0) {
      const inner = s.before.slice(openIdx + px)
        + s.sel
        + s.after.slice(0, closeIdx);
      const newAfter = s.after.slice(closeIdx + sx);
      return {
        value: s.before.slice(0, openIdx) + inner
          + newAfter,
        caretStart: s.ss - px,
        caretEnd: s.se - px,
      };
    }
  }
  // Selection contains the OPENING marker but the
  // closing is in `after` (e.g. "**he" selected in
  // "**hello**"). Pull both markers out so we get
  // a clean unwrap.
  if (
    s.sel.startsWith(prefix)
    && s.after.indexOf(suffix) !== -1
  ) {
    const closeIdx = s.after.indexOf(suffix);
    const inner = s.sel.slice(px)
      + s.after.slice(0, closeIdx);
    return {
      value: s.before + inner
        + s.after.slice(closeIdx + sx),
      caretStart: s.before.length,
      caretEnd: s.before.length + inner.length,
    };
  }
  // Symmetric: selection contains the CLOSING marker
  // ("lo**" in "**hello**").
  if (
    s.sel.endsWith(suffix)
    && s.before.lastIndexOf(prefix) !== -1
  ) {
    const openIdx = s.before.lastIndexOf(prefix);
    const inner = s.before.slice(openIdx + px)
      + s.sel.slice(0, s.sel.length - sx);
    return {
      value: s.before.slice(0, openIdx) + inner
        + s.after,
      caretStart: openIdx,
      caretEnd: openIdx + inner.length,
    };
  }
  // For block markers with no selection AND the
  // cursor's current line is non-empty, treat the
  // whole line as the implicit selection. Mirrors
  // what list / quote buttons already do (they
  // affect the current line) — without this, click-
  // ing Code on "hello" would insert an empty block
  // *below* it instead of wrapping the word.
  // Skipped when the caller explicitly asked for an
  // empty-block insert (after the user picked that
  // branch in the ambiguity dialog).
  if (
    !options.forceInsert
    && prefix.includes('\n')
    && !s.sel
  ) {
    const lineStart =
      s.before.lastIndexOf('\n') + 1;
    const lineEndRel = s.after.indexOf('\n');
    const headOfLine = s.before.slice(lineStart);
    const tailOfLine = lineEndRel === -1
      ? s.after : s.after.slice(0, lineEndRel);
    const line = headOfLine + tailOfLine;
    if (line.trim().length > 0) {
      const lineBefore = s.before.slice(0, lineStart);
      const lineAfter = lineEndRel === -1
        ? '' : s.after.slice(lineEndRel);
      const padHead =
        lineBefore !== ''
        && !lineBefore.endsWith('\n') ? '\n' : '';
      const padTail =
        lineAfter !== ''
        && !lineAfter.startsWith('\n') ? '\n' : '';
      return {
        value: lineBefore + padHead + prefix + line
          + suffix + padTail + lineAfter,
        caretStart:
          lineBefore.length + padHead.length + px,
        caretEnd: lineBefore.length + padHead.length
          + px + line.length,
      };
    }
  }
  // For block-style markers (those containing a
  // newline boundary, e.g. "```\n" / "\n```"),
  // optionally pad with a leading \n if there is
  // non-newline text before, and a trailing \n if
  // there is non-newline text after, so the block
  // doesn't smush against surrounding content. This
  // is purely cosmetic and never affects the
  // unwrap detection above (which looks at the
  // *literal* prefix/suffix in the text).
  const padBefore = (
    prefix.includes('\n')
    && s.before !== ''
    && !s.before.endsWith('\n')
  ) ? '\n' : '';
  const padAfter = (
    suffix.includes('\n')
    && s.after !== ''
    && !s.after.startsWith('\n')
  ) ? '\n' : '';
  // No selection → insert markers, caret between.
  if (!s.sel) {
    const c =
      s.before.length + padBefore.length + px;
    return {
      value: s.before + padBefore + prefix + suffix
        + padAfter + s.after,
      caretStart: c,
      caretEnd: c,
    };
  }
  // Plain wrap — leave inner text selected so the
  // user can type to replace or chain another action.
  return {
    value: s.before + padBefore + prefix + s.sel
      + suffix + padAfter + s.after,
    caretStart:
      s.before.length + padBefore.length + px,
    caretEnd:
      s.before.length + padBefore.length + px
      + s.sel.length,
  };
}

/** Apply an MdAction to the textarea state. */
export function applyMdAction(
  el: HTMLTextAreaElement, a: MdAction,
  options: MdActionOptions = {},
): MdActionResult {
  const s = read(el);
  if (a.linePrefix) {
    return applyLinePrefix(s, a.prefix);
  }
  return applyWrap(
    s, a.prefix, a.suffix ?? a.prefix, options,
  );
}

/** Detects the only ambiguous case the dialog
 *  needs to handle: a block-style action (Code) on
 *  a textarea that has content, no selection, and
 *  no existing fence pair around the cursor — so
 *  we genuinely don't know whether the user wants
 *  to wrap or insert. */
export function isMdActionAmbiguous(
  el: HTMLTextAreaElement, a: MdAction,
): boolean {
  if (a.linePrefix) return false;
  const suffix = a.suffix ?? a.prefix;
  if (!a.prefix.includes('\n')) return false;
  if (el.selectionStart !== el.selectionEnd) {
    return false;
  }
  const v = el.value;
  if (v.trim().length === 0) return false;
  const before = v.slice(0, el.selectionStart);
  const after = v.slice(el.selectionEnd);
  // Already inside an existing fence pair → wider
  // unwrap will fire, no ambiguity.
  if (
    before.lastIndexOf(a.prefix) >= 0
    && after.indexOf(suffix) >= 0
  ) {
    return false;
  }
  return true;
}
