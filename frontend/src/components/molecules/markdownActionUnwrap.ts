/**
 * Unwrap helpers — each returns a result if matched,
 * or null to fall through. Tried in priority order.
 * Edge-case selection helpers live in the sibling
 * markdownActionUnwrapEdge.ts file.
 */
import type {
  MdActionResult, MdState,
} from './markdownActionTypes';

export {
  unwrapOpeningInSel, unwrapClosingInSel,
} from './markdownActionUnwrapEdge';

/** Selection itself already wrapped → strip outer
 *  prefix/suffix and leave inner selected. */
export function unwrapSelection(
  s: MdState, prefix: string, suffix: string,
): MdActionResult | null {
  const px = prefix.length;
  const sx = suffix.length;
  if (
    s.sel.length < px + sx
    || !s.sel.startsWith(prefix)
    || !s.sel.endsWith(suffix)
  ) return null;
  const inner = s.sel.slice(px, s.sel.length - sx);
  return {
    value: s.before + inner + s.after,
    caretStart: s.before.length,
    caretEnd: s.before.length + inner.length,
  };
}

/** Cursor / selection sits between markers that are
 *  immediately adjacent. Stops rapid-click stacking. */
export function unwrapAdjacent(
  s: MdState, prefix: string, suffix: string,
): MdActionResult | null {
  if (
    !s.before.endsWith(prefix)
    || !s.after.startsWith(suffix)
  ) return null;
  const newBefore = s.before.slice(0, -prefix.length);
  const newAfter = s.after.slice(suffix.length);
  return {
    value: newBefore + s.sel + newAfter,
    caretStart: newBefore.length,
    caretEnd: newBefore.length + s.sel.length,
  };
}

/** Wider unwrap for BLOCK markers — cursor inside
 *  an existing fence pair with text on either side. */
export function unwrapBlockWider(
  s: MdState, prefix: string, suffix: string,
): MdActionResult | null {
  if (!prefix.includes('\n')) return null;
  const px = prefix.length;
  const sx = suffix.length;
  const openIdx = s.before.lastIndexOf(prefix);
  const closeIdx = s.after.indexOf(suffix);
  if (openIdx < 0 || closeIdx < 0) return null;
  const inner = s.before.slice(openIdx + px) + s.sel
    + s.after.slice(0, closeIdx);
  const newAfter = s.after.slice(closeIdx + sx);
  return {
    value: s.before.slice(0, openIdx) + inner
      + newAfter,
    caretStart: s.ss - px,
    caretEnd: s.se - px,
  };
}
