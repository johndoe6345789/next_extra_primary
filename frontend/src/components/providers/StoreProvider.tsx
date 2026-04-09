'use client';

import {
  type ReactElement, ReactNode, useState,
} from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from
  'redux-persist/integration/react';
import { makeStore } from '@/store/store';

/** Props for the Redux store provider. */
interface StoreProviderProps {
  /** Child components to render within store. */
  readonly children: ReactNode;
}

/**
 * Provides Redux store with persistence.
 *
 * Uses PersistGate to delay rendering until
 * localStorage has been read into the store,
 * ensuring auth state is available before any
 * route guard checks.
 *
 * @param props - Component props.
 * @returns Store-connected component tree.
 */
export function StoreProvider({
  children,
}: StoreProviderProps): ReactElement {
  const [{ store, persistor }] =
    useState(makeStore);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
