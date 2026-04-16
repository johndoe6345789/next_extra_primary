import React from 'react';
import { render, screen, fireEvent }
  from '@testing-library/react';
import { OAuthButtons } from '../OAuthButtons';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@shared/m3/Button', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
    'data-testid': tid,
    'aria-label': label,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    'data-testid'?: string;
    'aria-label'?: string;
  }) => (
    <button
      data-testid={tid}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

const assignSpy = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});
Object.defineProperty(window.location, 'href', {
  set: assignSpy,
  get: () => '',
});

describe('OAuthButtons', () => {
  beforeEach(() => assignSpy.mockClear());

  it('renders three provider buttons', () => {
    render(<OAuthButtons />);
    expect(
      screen.getByTestId('oauth-btn-google'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('oauth-btn-github'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('oauth-btn-microsoft'),
    ).toBeInTheDocument();
  });

  it('navigates to oauth URL on click', () => {
    render(<OAuthButtons />);
    fireEvent.click(
      screen.getByTestId('oauth-btn-google'),
    );
    expect(assignSpy).toHaveBeenCalledWith(
      '/api/auth/oauth/google/authorize',
    );
  });

  it('has data-testid on container', () => {
    render(<OAuthButtons />);
    expect(
      screen.getByTestId('oauth-buttons'),
    ).toBeInTheDocument();
  });
});
