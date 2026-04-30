/**
 * Edge-case unwrap helpers — selection contains only
 * the opening or only the closing marker.
 */
import type {
  MdActionResult, MdState,
} from './markdownActionTypes';

/** Selection contains the OPENING marker only. */
export function unwrapOpeningInSel(
  s: MdState, prefix: string, suffix: string,
): MdActionResult | null {
  if (
    !s.sel.startsWith(prefix)
    || s.after.indexOf(suffix) === -1
  ) return null;
  const px = prefix.length;
  const sx = suffix.length;
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

/** Symmetric — selection contains the CLOSING
 *  marker only. */
export function unwrapClosingInSel(
  s: MdState, prefix: string, suffix: string,
): MdActionResult | null {
  if (
    !s.sel.endsWith(suffix)
    || s.before.lastIndexOf(prefix) === -1
  ) return null;
  const px = prefix.length;
  const sx = suffix.length;
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
