import { applyMdAction } from './markdownAction';

const BOLD = { label: 'B', prefix: '**', suffix: '**' };
const ITAL = { label: 'I', prefix: '_', suffix: '_' };
// Match MarkdownToolbar's literal markers: the
// fence is "```\n" + content + "\n```", and any
// surrounding \n is added by applyWrap as needed.
const CODE = {
  label: 'Code',
  prefix: '```\n',
  suffix: '\n```',
};
const LIST = {
  label: '• List', prefix: '- ', linePrefix: true,
};

/** Build a fake textarea with selection. */
function ta(value: string, ss: number, se = ss) {
  return {
    value,
    selectionStart: ss,
    selectionEnd: se,
  } as HTMLTextAreaElement;
}

describe('applyMdAction wrap', () => {
  it('inserts markers + parks caret on empty', () => {
    const r = applyMdAction(ta('', 0), BOLD);
    expect(r.value).toBe('****');
    expect(r.caretStart).toBe(2);
    expect(r.caretEnd).toBe(2);
  });

  it('wraps a plain selection', () => {
    const r = applyMdAction(ta('hello', 0, 5), BOLD);
    expect(r.value).toBe('**hello**');
    expect(r.caretStart).toBe(2);
    expect(r.caretEnd).toBe(7);
  });

  it('unwraps when selection is already wrapped', () => {
    const r = applyMdAction(ta('**hi**', 0, 6), BOLD);
    expect(r.value).toBe('hi');
  });

  it('unwraps when cursor sits between markers', () => {
    const r = applyMdAction(ta('****', 2), BOLD);
    expect(r.value).toBe('');
  });

  it('unwraps when selection is INSIDE markers', () => {
    // sel = "hi" in "**hi**"
    const r = applyMdAction(ta('**hi**', 2, 4), BOLD);
    expect(r.value).toBe('hi');
    expect(r.caretEnd).toBe(2);
  });

  it('unwraps a partial selection that grabs only '
    + 'the opening marker', () => {
    // "**he" selected in "**hello**"
    const r = applyMdAction(ta('**hello**', 0, 4), BOLD);
    expect(r.value).toBe('hello');
  });

  it('unwraps a partial selection that grabs only '
    + 'the closing marker', () => {
    // "lo**" selected in "**hello**"
    const r = applyMdAction(ta('**hello**', 5, 9), BOLD);
    expect(r.value).toBe('hello');
  });

  it('uses italic markers independently of bold', () => {
    const r = applyMdAction(ta('hi', 0, 2), ITAL);
    expect(r.value).toBe('_hi_');
  });
});

describe('applyMdAction code block', () => {
  it('omits surrounding \\n at start/end of '
    + 'textarea (no leading/trailing blank line)', () => {
    const r = applyMdAction(ta('', 0), CODE);
    // Without the trim it would produce
    // "\n```\n\n```\n" — both ends of textarea
    // already provide their own boundaries.
    expect(r.value).toBe('```\n\n```');
  });

  it('unwraps a fenced block when caret sits in '
    + 'the middle of its content (no selection)', () => {
    // value: "```\nhello\n```", caret at 5
    // ("h" of hello). User clicks Code button.
    const r = applyMdAction(
      ta('```\nhello\n```', 5), CODE,
    );
    expect(r.value).toBe('hello');
    // Caret tracks the original position minus the
    // length of the removed leading fence.
    expect(r.caretStart).toBe(1);
  });

  it('unwraps fenced block from a selection that '
    + 'lives entirely between the fences', () => {
    // Select "hello" in "```\nhello\n```".
    const r = applyMdAction(
      ta('```\nhello\n```', 4, 9), CODE,
    );
    expect(r.value).toBe('hello');
  });

  it('wraps the current line when textarea has '
    + 'one word and no selection (regression — '
    + 'used to insert an empty block below it)',
    () => {
      const r = applyMdAction(ta('hello', 5), CODE);
      expect(r.value).toBe('```\nhello\n```');
      // Caret/selection lands ON the wrapped word
      // so a follow-up keystroke replaces it.
      expect(r.caretStart).toBe(4);
      expect(r.caretEnd).toBe(9);
    });

  it('wraps only the current line, not the whole '
    + 'textarea (multi-line case)', () => {
      // "hello\nworld", caret at 8 (in "world").
      const r = applyMdAction(
        ta('hello\nworld', 8), CODE,
      );
      expect(r.value).toBe('hello\n```\nworld\n```');
    });

  it('still inserts an empty block on a blank '
    + 'line (no content to wrap)', () => {
      const r = applyMdAction(
        ta('hello\n', 6), CODE,
      );
      expect(r.value).toBe('hello\n```\n\n```');
    });
});

describe('applyMdAction line prefix (lists/quotes)', () => {
  it('adds prefix to the current line', () => {
    const r = applyMdAction(ta('item', 0), LIST);
    expect(r.value).toBe('- item');
  });

  it('toggles off when every line has it', () => {
    const r = applyMdAction(ta('- a\n- b', 0, 7), LIST);
    expect(r.value).toBe('a\nb');
  });

  it('only adds prefix to bare lines when mixed', () => {
    const r = applyMdAction(
      ta('- a\nb\n- c', 0, 9), LIST,
    );
    expect(r.value).toBe('- a\n- b\n- c');
  });
});
