'use client';

import { type ReactElement, ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';

/** Props for the Redux store provider. */
interface StoreProviderProps {
  /** Child components to render within store. */
  readonly children: ReactNode;
}

/**
 * Provides Redux store with persistence to the app.
 *
 * Creates a singleton store instance via lazy
 * `useState` initializer. Rehydration is handled by
 * `persistStore()` inside `makeStore()` without
 * gating render — avoids SSR hydration mismatches.
 *
 * @param props - Component props.
 * @returns Store-connected component tree.
 */
export function StoreProvider({
  children,
}: StoreProviderProps): ReactElement {
  const [{ store }] = useState(makeStore);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
