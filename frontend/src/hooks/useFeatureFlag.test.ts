import { renderHook } from
  '@testing-library/react';
import React from 'react';
import { useFeatureFlag }
  from './useFeatureFlag';
import {
  FeatureFlagContext,
} from '@/contexts/FeatureFlagContext';

describe('useFeatureFlag', () => {
  it('returns true when flag is enabled', () => {
    const wrapper = ({
      children,
    }: { children: React.ReactNode }) =>
      React.createElement(
        FeatureFlagContext.Provider,
        { value: { ecommerce: true } },
        children,
      );

    const { result } = renderHook(
      () => useFeatureFlag('ecommerce'),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });

  it('returns false when flag is disabled', () => {
    const wrapper = ({
      children,
    }: { children: React.ReactNode }) =>
      React.createElement(
        FeatureFlagContext.Provider,
        { value: { ecommerce: false } },
        children,
      );

    const { result } = renderHook(
      () => useFeatureFlag('ecommerce'),
      { wrapper },
    );
    expect(result.current).toBe(false);
  });

  it('returns undefined when flag not in map', () => {
    const wrapper = ({
      children,
    }: { children: React.ReactNode }) =>
      React.createElement(
        FeatureFlagContext.Provider,
        { value: {} },
        children,
      );

    const { result } = renderHook(
      () => useFeatureFlag('unknown'),
      { wrapper },
    );
    expect(result.current).toBeUndefined();
  });
});
