/**
 * Redux-persist configuration.
 * Only auth and theme slices are persisted.
 * @module store/persistConfig
 */
import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';
import type { RootReducerState } from './store';

/** Persist config — whitelists auth & theme. */
export const persistConfig: PersistConfig<RootReducerState> = {
  key: 'nextra-root',
  storage,
  whitelist: ['auth', 'theme'],
};
