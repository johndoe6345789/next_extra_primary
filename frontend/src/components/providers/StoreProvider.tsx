'use client';

import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
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
 * `useState` initializer. Wraps children in both
 * `Provider` and `PersistGate` for rehydration.
 *
 * @param props - Component props.
 * @returns Store-connected component tree.
 */
export function StoreProvider({ children }: StoreProviderProps): JSX.Element {
  const [{ store, persistor }] = useState(makeStore);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
