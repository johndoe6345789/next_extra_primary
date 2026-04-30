/**
 * Line-prefix actions (lists, quotes, headings) for
 * the markdown editor toolbar.
 *
 * Rules:
 *   - If EVERY line in the selection already starts
 *     with the prefix → strip from each (toggle off).
 *   - Otherwise add the prefix only to lines that
 *     LACK it (so a partially-prefixed selection
 *     becomes fully-prefixed instead of doubling
 *     the prefix on lines that already had it).
 */
import type {
  MdActionResult, MdState,
} from './markdownActionTypes';

export function applyLinePrefix(
  s: MdState, prefix: string,
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
