import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureFlagProvider }
  from '../FeatureFlagProvider';
import {
  FeatureFlagContext,
} from '@/contexts/FeatureFlagContext';
import { useEvaluateFlagsQuery }
  from '@/store/api/flagsApi';

jest.mock('@/store/api/flagsApi', () => ({
  useEvaluateFlagsQuery: jest.fn(),
}));

jest.mock('@/constants/feature-flags.json', () => ({
  flags: ['ecommerce', 'social'],
}));

const mockUseEvaluateFlagsQuery =
  useEvaluateFlagsQuery as jest.Mock;

/** Helper: consume context value in a child. */
function FlagReader() {
  const flags = React.useContext(
    FeatureFlagContext,
  );
  return (
    <span data-testid="flags">
      {JSON.stringify(flags)}
    </span>
  );
}

describe('FeatureFlagProvider', () => {
  it('passes fetched flags to context', () => {
    mockUseEvaluateFlagsQuery.mockReturnValue({
      data: { ecommerce: true, social: false },
    });

    render(
      <FeatureFlagProvider>
        <FlagReader />
      </FeatureFlagProvider>,
    );

    const text =
      screen.getByTestId('flags').textContent;
    const parsed = JSON.parse(text ?? '{}');
    expect(parsed.ecommerce).toBe(true);
    expect(parsed.social).toBe(false);
  });

  it('falls back to initialFlags when no data', () => {
    mockUseEvaluateFlagsQuery.mockReturnValue({
      data: undefined,
    });

    render(
      <FeatureFlagProvider
        initialFlags={{ wiki: true }}
      >
        <FlagReader />
      </FeatureFlagProvider>,
    );

    const text =
      screen.getByTestId('flags').textContent;
    const parsed = JSON.parse(text ?? '{}');
    expect(parsed.wiki).toBe(true);
  });
});
