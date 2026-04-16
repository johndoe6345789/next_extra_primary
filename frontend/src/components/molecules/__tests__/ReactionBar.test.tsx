import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { ReactionBar } from '../ReactionBar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks/useReactions', () => ({
  useReactions: () => ({
    reactions: [
      { emoji: '👍', count: 2, reacted: true },
      { emoji: '❤️', count: 1, reacted: false },
    ],
    isLoading: false,
    toggle: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('@shared/m3', () => ({
  Box: ({
    children,
    component,
    onClick,
    ...rest
  }: {
    children?: React.ReactNode;
    component?: string;
    onClick?: () => void;
    [key: string]: unknown;
  }) => {
    const Tag = (component ?? 'div') as keyof JSX.IntrinsicElements;
    return (
      <Tag onClick={onClick} {...rest}>
        {children}
      </Tag>
    );
  },
}));

describe('ReactionBar', () => {
  it('renders reaction chips', () => {
    render(
      <ReactionBar targetType="post" targetId="p1" />,
    );
    expect(
      screen.getByTestId('reaction-bar-emoji-👍'),
    ).toBeInTheDocument();
  });

  it('shows the + add button', () => {
    render(
      <ReactionBar targetType="post" targetId="p1" />,
    );
    expect(
      screen.getByTestId('reaction-bar-add'),
    ).toBeInTheDocument();
  });

  it('opens picker on + click', () => {
    render(
      <ReactionBar targetType="post" targetId="p1" />,
    );
    fireEvent.click(
      screen.getByTestId('reaction-bar-add'),
    );
    expect(
      screen.getByTestId('reaction-bar-picker'),
    ).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(
      <ReactionBar targetType="post" targetId="p1" />,
    );
    expect(
      screen.getByTestId('reaction-bar'),
    ).toHaveAttribute('aria-label', 'reactions');
  });
});
