/**
 * The toolbar's button definitions and the
 * sync-write helper they share.
 */
import type {
  MdActionOptions, MdActionResult, MdAction,
} from './markdownActionTypes';
import { applyMdAction } from './markdownAction';

/** Smart toggle behaviour applies to every button:
 *  empty selection inserts markers and parks the
 *  caret between them; text selection wraps;
 *  already-wrapped selection (or cursor inside
 *  markers) unwraps. */
export const MD_ACTIONS: MdAction[] = [
  { label: 'B', prefix: '**', suffix: '**' },
  { label: 'I', prefix: '_', suffix: '_' },
  { label: '</>', prefix: '`', suffix: '`' },
  // Code-block markers MATCH the literal characters
  // inserted into the text so the unwrap path can
  // spot them on a second click.
  { label: 'Code',
    prefix: '```\n', suffix: '\n```' },
  { label: '• List',
    prefix: '- ', linePrefix: true },
  { label: '1. List',
    prefix: '1. ', linePrefix: true },
  { label: '"', prefix: '> ', linePrefix: true },
];

/** Push a new value + selection to the textarea
 *  with the dual-write trick that protects against
 *  rapid-click marker stacking and React's
 *  collapse-selection-on-commit. See the 6-rapid-
 *  click regression tests. */
export function writeBackToTextarea(
  el: HTMLTextAreaElement,
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string, caretStart: number, caretEnd: number,
  onChange: (next: string) => void,
): void {
  const set = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value',
  )?.set;
  set?.call(el, value);
  el.setSelectionRange(caretStart, caretEnd);
  onChange(value);
  requestAnimationFrame(() => {
    const cur = ref.current;
    if (!cur) return;
    cur.focus();
    cur.setSelectionRange(caretStart, caretEnd);
  });
}

/** Convenience: applyMdAction + writeBackToTextarea. */
export function applyAndWrite(
  el: HTMLTextAreaElement,
  ref: React.RefObject<HTMLTextAreaElement | null>,
  a: MdAction,
  onChange: (next: string) => void,
  opts: MdActionOptions = {},
): MdActionResult {
  const r = applyMdAction(el, a, opts);
  writeBackToTextarea(
    el, ref, r.value, r.caretStart, r.caretEnd,
    onChange,
  );
  return r;
}

/** Cmd/Ctrl+B → bold, Cmd/Ctrl+I → italic.
 *  Returns true if the event was handled. */
const KEY_ACTIONS: Record<string, MdAction> = {
  b: { label: 'B', prefix: '**', suffix: '**' },
  i: { label: 'I', prefix: '_', suffix: '_' },
};

export function handleMdKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  ref: React.RefObject<HTMLTextAreaElement | null>,
  onChange: (next: string) => void,
): boolean {
  if (!(e.metaKey || e.ctrlKey)) return false;
  const a = KEY_ACTIONS[e.key.toLowerCase()];
  if (!a || !ref.current) return false;
  e.preventDefault();
  applyAndWrite(ref.current, ref, a, onChange);
  return true;
}
