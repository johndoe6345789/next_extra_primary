"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  makeStore,
  type AppStore,
} from "@/store/store";

/** Props for the Redux store provider. */
interface StoreProviderProps {
  /** Child components to render within store. */
  readonly children: ReactNode;
}

/**
 * Provides Redux store with persistence to the app.
 *
 * Creates a singleton store instance per component
 * mount via `useRef`. Wraps children in both
 * `Provider` and `PersistGate` for rehydration.
 *
 * @param props - Component props.
 * @returns Store-connected component tree.
 */
export function StoreProvider({
  children,
}: StoreProviderProps): JSX.Element {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    const { store, persistor } = makeStore();
    storeRef.current = Object.assign(store, {
      __persistor: persistor,
    });
  }

  const store = storeRef.current;
  type WithPersistor = AppStore & {
    __persistor: ReturnType<
      typeof makeStore
    >["persistor"];
  };
  const persistor = (
    store as WithPersistor
  ).__persistor;

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
