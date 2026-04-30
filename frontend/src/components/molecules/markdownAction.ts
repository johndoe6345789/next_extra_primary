/**
 * Smart "wrap / unwrap / toggle" entry points for
 * the markdown editor toolbar. The actual rules live
 * in markdownActionWrap.ts (inline + block wraps)
 * and markdownActionLine.ts (lists / quotes).
 *
 *   - empty selection      → insert prefix+suffix
 *                            and place caret between
 *   - selection wrapped    → unwrap (toggle off)
 *   - cursor inside wrap   → unwrap (toggle off)
 *   - selection unwrapped  → wrap, leave it selected
 *
 * Line-prefix actions (lists, quotes) toggle the
 * prefix on every selected line.
 */

import {
  readMdState,
  type MdAction, type MdActionOptions,
  type MdActionResult,
} from './markdownActionTypes';
import { applyWrap } from './markdownActionWrap';
import { applyLinePrefix } from './markdownActionLine';

export type {
  MdAction, MdActionOptions, MdActionResult,
} from './markdownActionTypes';

/** Apply an MdAction to the textarea state. */
export function applyMdAction(
  el: HTMLTextAreaElement, a: MdAction,
  options: MdActionOptions = {},
): MdActionResult {
  const s = readMdState(el);
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
