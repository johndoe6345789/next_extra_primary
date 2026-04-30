/**
 * @jest-environment jsdom
 *
 * Regression tests for the rapid-click race that
 * caused buttons (especially Code) to stack markers
 * — e.g. clicking Code three times in a row used
 * to produce two stacked fenced blocks because each
 * click read the textarea's stale value before the
 * previous click's React state commit landed.
 *
 * The fix: write the new value + selection to the
 * DOM synchronously *before* calling onChange. This
 * test wires up a real controlled textarea + the
 * toolbar and checks every action toggles correctly
 * across two back-to-back synchronous clicks.
 */
import React, { useRef, useState } from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';

// The real @shared/m3 Box/Button drag in a wide
// transitive graph (theme tokens, sx parser, etc.)
// that Jest can't resolve cleanly. Substitute lean
// DOM stubs here — what we're testing is the
// toolbar click logic, not the M3 styling.
jest.mock('@shared/m3', () => ({
  Box: ({
    children, component: C = 'div', ...rest
  }: {
    children?: React.ReactNode;
    component?: React.ElementType;
    [k: string]: unknown;
  }) => <C {...rest}>{children}</C>,
  Button: ({
    children, onClick, testId, type, disabled,
    ...rest
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    testId?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    [k: string]: unknown;
  }) => (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      {...rest}
    >
      {children}
    </button>
  ),
  Typography: ({
    children, component: C = 'span', ...rest
  }: {
    children?: React.ReactNode;
    component?: React.ElementType;
    [k: string]: unknown;
  }) => <C {...rest}>{children}</C>,
  TextField: ({
    label, value, onChange,
    'data-testid': tid, required,
  }: {
    label?: string;
    value: string;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    'data-testid'?: string;
    required?: boolean;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={onChange}
      data-testid={tid}
      required={required}
    />
  ),
}));

// eslint-disable-next-line import/first
import { MarkdownToolbar } from './MarkdownToolbar';

function Harness({
  initial = '',
}: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  return (
    <>
      <MarkdownToolbar
        textareaRef={ref}
        onChange={setValue}
      />
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="ta"
      />
    </>
  );
}

function setSel(
  ta: HTMLTextAreaElement, ss: number, se: number,
) {
  ta.focus();
  ta.setSelectionRange(ss, se);
}

describe('MarkdownToolbar rapid clicks', () => {
  it('Code: two rapid clicks toggle off — does '
    + 'NOT stack markers', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-Code');
    fireEvent.click(btn);
    fireEvent.click(btn);
    // First click inserts a fence; second click
    // sees that fence and unwraps it.
    expect(ta.value).toBe('');
  });

  it('Bold: three rapid clicks land at empty', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-B');
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    // 1st: "" → "****"
    // 2nd: "****"   (cursor between) → ""
    // 3rd: ""       → "****"
    expect(ta.value).toBe('****');
  });

  it('Bold on selected text: rapid clicks toggle', () => {
    render(<Harness initial="hi" />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 0, 2);
    const btn = screen.getByTestId('md-tb-B');
    fireEvent.click(btn);
    expect(ta.value).toBe('**hi**');
    // After click, selection is on the "hi" inside
    // the markers — second click should unwrap.
    fireEvent.click(btn);
    expect(ta.value).toBe('hi');
  });

  it('Italic: rapid clicks toggle from empty', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-I');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(ta.value).toBe('');
  });

  it('• List: rapid clicks toggle on a single line',
    () => {
      render(<Harness initial="item" />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 0, 4);
      const btn = screen.getByTestId('md-tb-• List');
      fireEvent.click(btn);
      expect(ta.value).toBe('- item');
      fireEvent.click(btn);
      expect(ta.value).toBe('item');
    });

  it('Code: 6 rapid clicks oscillate, never stack '
    + '(reproduces the ```\\n```\\n```\\n``` bug)',
    () => {
      render(<Harness />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 0, 0);
      const btn = screen.getByTestId('md-tb-Code');
      for (let i = 0; i < 6; i++) {
        fireEvent.click(btn);
      }
      // 6 clicks = 3 toggles → final is "" (empty).
      // The bug we're guarding against produced
      // multiple stacked fences instead.
      expect(ta.value).toBe('');
    });

  it('Inline code: 6 rapid clicks never produce '
    + '`````` (six backticks)', () => {
      render(<Harness />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 0, 0);
      const btn = screen.getByTestId('md-tb-</>');
      for (let i = 0; i < 6; i++) {
        fireEvent.click(btn);
      }
      expect(ta.value).toBe('');
      // Specifically must NOT contain stacked
      // backtick markers.
      expect(ta.value.includes('``````')).toBe(false);
    });
});

describe('MarkdownToolbar Code ambiguity dialog', () => {
  it('opens a dialog when clicking Code on '
    + 'non-empty content with no selection', () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      // The textarea is unchanged until the user
      // picks a branch.
      expect(ta.value).toBe('hello');
      expect(
        screen.getByTestId('md-action-dialog'),
      ).toBeInTheDocument();
    });

  it('"Wrap current line" choice wraps the word',
    () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      fireEvent.click(
        screen.getByTestId('md-action-dialog-wrap'),
      );
      expect(ta.value).toBe('```\nhello\n```');
    });

  it('"Insert empty block" choice keeps content '
    + 'and inserts a new block', () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      fireEvent.click(
        screen.getByTestId(
          'md-action-dialog-insert',
        ),
      );
      expect(ta.value).toBe('hello\n```\n\n```');
    });

  it('Cancel leaves the textarea unchanged', () => {
    render(<Harness initial="hello" />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 5, 5);
    fireEvent.click(screen.getByTestId('md-tb-Code'));
    fireEvent.click(
      screen.getByTestId('md-action-dialog-cancel'),
    );
    expect(ta.value).toBe('hello');
    expect(
      screen.queryByTestId('md-action-dialog'),
    ).toBeNull();
  });

  it('does NOT open the dialog when clicking Code '
    + 'inside an existing fenced block', () => {
      render(<Harness initial={'```\nhi\n```'} />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      // No dialog — wider-unwrap fires immediately.
      expect(
        screen.queryByTestId('md-action-dialog'),
      ).toBeNull();
      expect(ta.value).toBe('hi');
    });
});

describe('MarkdownToolbar Link dialog', () => {
  it('opens a dialog instead of inserting a stub',
    () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Link'),
      );
      expect(
        screen.getByTestId('link-dialog'),
      ).toBeInTheDocument();
      // Cancel returns the textarea unchanged.
      fireEvent.click(
        screen.getByTestId('link-dialog-cancel'),
      );
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      expect(ta.value).toBe('');
    });

  it('inserts [text](url) at the cursor', () => {
    render(<Harness />);
    fireEvent.click(
      screen.getByTestId('md-tb-Link'),
    );
    fireEvent.change(
      screen.getByTestId('link-dialog-text'),
      { target: { value: 'click' } },
    );
    fireEvent.change(
      screen.getByTestId('link-dialog-url'),
      { target: { value: 'https://example.com' } },
    );
    fireEvent.click(
      screen.getByTestId('link-dialog-insert'),
    );
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    expect(ta.value).toBe(
      '[click](https://example.com)',
    );
  });

  it('pre-fills the text field with the current '
    + 'selection', () => {
    render(<Harness initial="hello" />);
    const ta = screen.getByTestId(
      'ta',
    ) as HTMLTextAreaElement;
    setSel(ta, 0, 5);
    fireEvent.click(
      screen.getByTestId('md-tb-Link'),
    );
    expect(
      (screen.getByTestId(
        'link-dialog-text',
      ) as HTMLInputElement).value,
    ).toBe('hello');
  });

  it('refuses to insert when URL is empty', () => {
    render(<Harness />);
    fireEvent.click(
      screen.getByTestId('md-tb-Link'),
    );
    const submit = screen.getByTestId(
      'link-dialog-insert',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
  });
});

describe('MarkdownToolbar Code language menu', () => {
  it('chevron opens a language menu listing the '
    + 'supported languages', () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'),
      );
      expect(
        screen.getByTestId('code-lang-menu'),
      ).toBeInTheDocument();
      // Spot-check a couple of common ones.
      expect(
        screen.getByTestId('code-lang-typescript'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('code-lang-python'),
      ).toBeInTheDocument();
    });

  it('picking a language inserts a fenced block '
    + 'with that language tag', () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'),
      );
      fireEvent.click(
        screen.getByTestId('code-lang-python'),
      );
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      expect(ta.value).toBe('```python\n\n```');
    });

  it('picking "Plain" inserts a language-less '
    + 'fenced block', () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'),
      );
      fireEvent.click(
        screen.getByTestId('code-lang-plain'),
      );
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      expect(ta.value).toBe('```\n\n```');
    });

  it('picking a language wraps an existing '
    + 'selection', () => {
      render(<Harness initial="print('hi')" />);
      const ta = screen.getByTestId(
        'ta',
      ) as HTMLTextAreaElement;
      setSel(ta, 0, ta.value.length);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'),
      );
      fireEvent.click(
        screen.getByTestId('code-lang-python'),
      );
      expect(ta.value).toBe(
        "```python\nprint('hi')\n```",
      );
    });
});
