import { applyMdAction } from './markdownAction';

const BOLD = { label: 'B', prefix: '**', suffix: '**' };
const ITAL = { label: 'I', prefix: '_', suffix: '_' };
const CODE = {
  label: 'Code',
  prefix: '\n```\n',
  suffix: '\n```\n',
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

  it('keeps the leading \\n when there is content '
    + 'before but not a newline', () => {
    const r = applyMdAction(ta('hello', 5), CODE);
    expect(r.value.startsWith('hello\n```')).toBe(true);
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
