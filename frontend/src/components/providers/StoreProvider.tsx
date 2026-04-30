'use client';

import {
  type ReactElement, ReactNode, useState,
} from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { useInitAuth } from '@/hooks/useInitAuth';

/** Props for the Redux store provider. */
interface StoreProviderProps {
  /** Child components to render within store. */
  readonly children: ReactNode;
}

/**
 * Calls useInitAuth inside the Provider tree.
 * Must be a separate component so it can access
 * the Redux dispatch provided by <Provider> above.
 */
function AuthInitializer({
  children,
}: StoreProviderProps): ReactElement {
  useInitAuth();
  return <>{children}</>;
}

/**
 * Provides Redux store with persistence.
 * Auth state is NOT persisted to localStorage —
 * it is bootstrapped on every startup via the
 * HttpOnly SSO cookie (useInitAuth).
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
      {/*
        PersistGate's loading={null} blanks the SSR
        body because the persistor never bootstraps
        on the server (no localStorage). Render the
        tree immediately and let redux-persist swap
        in persisted state when it rehydrates on
        the client; non-persisted slices already
        have their default values.
      */}
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
