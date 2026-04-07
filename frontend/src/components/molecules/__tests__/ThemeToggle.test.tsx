import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

jest.mock('@/hooks', () => ({
  useThemeMode: () => ({
    mode: 'dark',
    toggleMode: jest.fn(),
  }),
}));

jest.mock('../../atoms', () => ({
  IconButton: ({
    icon,
    ariaLabel,
    testId,
  }: {
    icon: React.ReactNode;
    ariaLabel: string;
    testId?: string;
  }) => (
    <button
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {icon}
    </button>
  ),
}));

jest.mock('@shared/icons/LightMode', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <svg data-testid="light-icon" {...props} />
  ),
}));

jest.mock('@shared/icons/DarkMode', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <svg data-testid="dark-icon" {...props} />
  ),
}));

describe('ThemeToggle', () => {
  it('passes bold strokeWidth to icon', () => {
    render(<ThemeToggle />);
    const icon = screen.getByTestId('dark-icon');
    expect(
      Number(icon.getAttribute('stroke-width')),
    ).toBeGreaterThanOrEqual(10);
  });

  it('sets white color style on icon', () => {
    render(<ThemeToggle />);
    const icon = screen.getByTestId('dark-icon');
    expect(icon.style.color).toBe(
      'rgb(255, 255, 255)',
    );
  });

  it('renders with accessible label', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByLabelText('Toggle light mode'),
    ).toBeInTheDocument();
  });
});
