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
  Box: ({ children, ...rest }: {
    children?: React.ReactNode;
    [k: string]: unknown;
  }) => <div {...rest}>{children}</div>,
  Button: ({
    children, onClick, testId, ...rest
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    testId?: string;
    [k: string]: unknown;
  }) => (
    <button
      type="button"
      onClick={onClick}
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
