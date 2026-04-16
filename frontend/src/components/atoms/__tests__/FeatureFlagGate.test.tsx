import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureFlagGate } from '../FeatureFlagGate';
import {
  FeatureFlagContext,
} from '@/contexts/FeatureFlagContext';

/** Wrap under a context with the given flags. */
function renderWithFlags(
  flags: Record<string, boolean>,
  ui: React.ReactElement,
) {
  return render(
    <FeatureFlagContext.Provider value={flags}>
      {ui}
    </FeatureFlagContext.Provider>,
  );
}

describe('FeatureFlagGate', () => {
  it('renders children when flag is true', () => {
    renderWithFlags(
      { ecommerce: true },
      <FeatureFlagGate flag="ecommerce">
        <span>Cart</span>
      </FeatureFlagGate>,
    );
    expect(screen.getByText('Cart'))
      .toBeInTheDocument();
  });

  it('renders fallback when flag is false', () => {
    renderWithFlags(
      { ecommerce: false },
      <FeatureFlagGate
        flag="ecommerce"
        fallback={<span>Fallback</span>}
      >
        <span>Cart</span>
      </FeatureFlagGate>,
    );
    expect(screen.getByText('Fallback'))
      .toBeInTheDocument();
    expect(screen.queryByText('Cart'))
      .not.toBeInTheDocument();
  });

  it('renders null fallback when flag unknown', () => {
    const { container } = renderWithFlags(
      {},
      <FeatureFlagGate flag="unknown">
        <span>Hidden</span>
      </FeatureFlagGate>,
    );
    expect(screen.queryByText('Hidden'))
      .not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});
