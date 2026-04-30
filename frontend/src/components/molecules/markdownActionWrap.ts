/**
 * Wrap / insert fallbacks + dispatcher. The unwrap
 * branches live in markdownActionUnwrap.ts.
 */
import type {
  MdActionOptions, MdActionResult, MdState,
} from './markdownActionTypes';
import {
  unwrapSelection, unwrapAdjacent, unwrapBlockWider,
  unwrapOpeningInSel, unwrapClosingInSel,
} from './markdownActionUnwrap';

/** Block actions on a non-empty current line and no
 *  selection: treat the whole line as the implicit
 *  selection (mirrors how list/quote work). */
function autoWrapCurrentLine(
  s: MdState, prefix: string, suffix: string,
  options: MdActionOptions,
): MdActionResult | null {
  if (
    options.forceInsert
    || !prefix.includes('\n')
    || s.sel
  ) return null;
  const lineStart = s.before.lastIndexOf('\n') + 1;
  const lineEndRel = s.after.indexOf('\n');
  const headOfLine = s.before.slice(lineStart);
  const tailOfLine = lineEndRel === -1
    ? s.after : s.after.slice(0, lineEndRel);
  const line = headOfLine + tailOfLine;
  if (line.trim().length === 0) return null;
  const lineBefore = s.before.slice(0, lineStart);
  const lineAfter = lineEndRel === -1
    ? '' : s.after.slice(lineEndRel);
  const padHead = lineBefore !== ''
    && !lineBefore.endsWith('\n') ? '\n' : '';
  const padTail = lineAfter !== ''
    && !lineAfter.startsWith('\n') ? '\n' : '';
  return {
    value: lineBefore + padHead + prefix + line
      + suffix + padTail + lineAfter,
    caretStart: lineBefore.length + padHead.length
      + prefix.length,
    caretEnd: lineBefore.length + padHead.length
      + prefix.length + line.length,
  };
}

/** Insert markers / wrap selection — fallthrough when
 *  no unwrap branch matched. Pads block markers with
 *  \n so neighbouring text doesn't smush the fence. */
function insertOrWrap(
  s: MdState, prefix: string, suffix: string,
): MdActionResult {
  const px = prefix.length;
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
  if (!s.sel) {
    const c = s.before.length + padBefore.length + px;
    return {
      value: s.before + padBefore + prefix + suffix
        + padAfter + s.after,
      caretStart: c,
      caretEnd: c,
    };
  }
  return {
    value: s.before + padBefore + prefix + s.sel
      + suffix + padAfter + s.after,
    caretStart: s.before.length + padBefore.length
      + px,
    caretEnd: s.before.length + padBefore.length
      + px + s.sel.length,
  };
}

/** Top-level wrap dispatcher — runs the unwrap
 *  helpers in priority order and falls through to
 *  insertOrWrap. */
export function applyWrap(
  s: MdState, prefix: string, suffix: string,
  options: MdActionOptions = {},
): MdActionResult {
  return unwrapSelection(s, prefix, suffix)
    ?? unwrapAdjacent(s, prefix, suffix)
    ?? unwrapBlockWider(s, prefix, suffix)
    ?? unwrapOpeningInSel(s, prefix, suffix)
    ?? unwrapClosingInSel(s, prefix, suffix)
    ?? autoWrapCurrentLine(s, prefix, suffix, options)
    ?? insertOrWrap(s, prefix, suffix);
}
