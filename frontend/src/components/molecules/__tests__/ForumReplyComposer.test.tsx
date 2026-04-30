/**
 * @jest-environment jsdom
 *
 * The composer now embeds MarkdownEditor (which has
 * its own toolbar + textarea), so this test mounts
 * the real component and drives it via the
 * underlying textarea found by data-testid.
 */
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

// Lean stubs for M3 primitives — same trick as the
// MarkdownToolbar test. We're testing form
// behaviour, not the design system.
jest.mock('@shared/m3', () => ({
  Box: ({ children, component: C = 'div', ...p }: {
    children: React.ReactNode;
    component?: React.ElementType;
    [k: string]: unknown;
  }) => <C {...p}>{children}</C>,
  Typography: ({
    children, ...p
  }: React.PropsWithChildren<{ [k: string]: unknown }>) =>
    <span {...p}>{children}</span>,
  TextField: ({
    value, onChange, onKeyDown, 'aria-label': a,
    'data-testid': tid, placeholder, disabled,
  }: {
    value: string;
    onChange: (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    onKeyDown?: React.KeyboardEventHandler<
      HTMLTextAreaElement
    >;
    'aria-label'?: string;
    'data-testid'?: string;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      aria-label={a}
      placeholder={placeholder}
      disabled={disabled}
      data-testid={tid}
    />
  ),
  Button: ({
    children, type, disabled, 'aria-label': a,
    onClick, testId,
  }: {
    children: React.ReactNode;
    type?: string;
    disabled?: boolean;
    'aria-label'?: string;
    onClick?: () => void;
    testId?: string;
  }) => (
    <button
      type={(type ?? 'button') as 'button' | 'submit'}
      disabled={disabled}
      aria-label={a}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  ),
}));

// eslint-disable-next-line import/first
import { ForumReplyComposer } from '../ForumReplyComposer';

function getInput() {
  return screen.getByTestId(
    'md-editor-input',
  ) as HTMLTextAreaElement;
}

describe('ForumReplyComposer', () => {
  it('renders the markdown editor textarea', () => {
    render(
      <ForumReplyComposer onSubmit={jest.fn()} />,
    );
    expect(getInput()).toBeInTheDocument();
  });

  it('calls onSubmit with trimmed body', async () => {
    const onSubmit = jest.fn()
      .mockResolvedValue(undefined);
    render(
      <ForumReplyComposer onSubmit={onSubmit} />,
    );
    fireEvent.change(getInput(), {
      target: { value: '  hello  ' },
    });
    fireEvent.submit(
      screen.getByTestId('forum-reply-composer'),
    );
    await waitFor(() =>
      expect(onSubmit)
        .toHaveBeenCalledWith('hello'),
    );
  });

  it('shows error for empty submit', async () => {
    render(
      <ForumReplyComposer onSubmit={jest.fn()} />,
    );
    fireEvent.submit(
      screen.getByTestId('forum-reply-composer'),
    );
    await waitFor(() =>
      expect(screen.getByText('replyRequired'))
        .toBeInTheDocument(),
    );
  });

  it('disables submit while in flight', async () => {
    let resolve!: () => void;
    const onSubmit = jest.fn(
      () => new Promise<void>((r) => { resolve = r; }),
    );
    render(
      <ForumReplyComposer onSubmit={onSubmit} />,
    );
    fireEvent.change(getInput(), {
      target: { value: 'hi' },
    });
    fireEvent.submit(
      screen.getByTestId('forum-reply-composer'),
    );
    const btn = screen.getByTestId(
      'forum-reply-submit',
    ) as HTMLButtonElement;
    await waitFor(() =>
      expect(btn.disabled).toBe(true),
    );
    resolve();
    await waitFor(() =>
      expect(btn.disabled).toBe(false),
    );
  });

  it('persists the draft to localStorage when '
    + 'storageKey is set', async () => {
    render(
      <ForumReplyComposer
        onSubmit={jest.fn()}
        storageKey="forum-draft-test"
      />,
    );
    fireEvent.change(getInput(), {
      target: { value: 'wip reply' },
    });
    await waitFor(() =>
      expect(
        localStorage.getItem('forum-draft-test'),
      ).toBe('wip reply'),
    );
    localStorage.removeItem('forum-draft-test');
  });
});
