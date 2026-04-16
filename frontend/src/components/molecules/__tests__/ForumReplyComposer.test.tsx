import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { ForumReplyComposer } from '../ForumReplyComposer';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@shared/m3', () => ({
  Box: ({ children, component: C = 'div', ...p }: {
    children: React.ReactNode;
    component?: React.ElementType;
    [key: string]: unknown;
  }) => <C {...p}>{children}</C>,
  Typography: ({ children }: React.PropsWithChildren) =>
    <span>{children}</span>,
  TextField: ({
    value, onChange, label, 'aria-label': a,
    'data-testid': tid,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    label?: string;
    'aria-label'?: string;
    'data-testid'?: string;
  }) => (
    <textarea
      value={value}
      onChange={onChange}
      aria-label={a ?? label}
      data-testid={tid}
    />
  ),
  Button: ({
    children, type, disabled, 'aria-label': a,
  }: {
    children: React.ReactNode;
    type?: string;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <button type={(type ?? 'button') as 'button' | 'submit'}
      disabled={disabled} aria-label={a}
    >
      {children}
    </button>
  ),
}));

describe('ForumReplyComposer', () => {
  it('renders textarea', () => {
    render(
      <ForumReplyComposer onSubmit={jest.fn()} />,
    );
    expect(
      screen.getByTestId('forum-reply-input'),
    ).toBeInTheDocument();
  });

  it('calls onSubmit with trimmed body', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ForumReplyComposer onSubmit={onSubmit} />);
    fireEvent.change(
      screen.getByTestId('forum-reply-input'),
      { target: { value: '  hello  ' } },
    );
    fireEvent.submit(
      screen.getByTestId('forum-reply-composer'),
    );
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith('hello'),
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
      expect(screen.getByText('replyRequired')).toBeInTheDocument(),
    );
  });
});
