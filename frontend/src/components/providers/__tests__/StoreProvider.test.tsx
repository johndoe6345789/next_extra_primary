import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '../StoreProvider';

jest.mock('@/store/store', () => ({
  makeStore: () => ({
    store: {
      getState: jest.fn(() => ({})),
      dispatch: jest.fn(),
      subscribe: jest.fn(() => jest.fn()),
      replaceReducer: jest.fn(),
      [Symbol.observable]: jest.fn(),
    },
    persistor: { persist: jest.fn() },
  }),
}));

describe('StoreProvider', () => {
  it('renders children immediately without gating', () => {
    render(
      <StoreProvider>
        <div data-testid="child">Hello</div>
      </StoreProvider>,
    );
    expect(
      screen.getByTestId('child'),
    ).toBeInTheDocument();
  });

  it('does not render PersistGate', () => {
    const { container } = render(
      <StoreProvider>
        <span>Content</span>
      </StoreProvider>,
    );
    expect(container.textContent).toBe('Content');
  });
});
