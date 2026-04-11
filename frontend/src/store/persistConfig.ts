/**
 * Redux-persist configuration.
 * Only auth and theme slices are persisted.
 * @module store/persistConfig
 */
import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';
import type { RootReducerState } from './store';

/** Persist config — only theme is persisted.
 *  Auth state is hydrated from the HttpOnly SSO cookie
 *  via GET /api/auth/sso-session on app startup, so
 *  tokens are never written to localStorage.
 */
export const persistConfig: PersistConfig<RootReducerState> = {
  key: 'nextra-root',
  storage,
  whitelist: ['theme'],
};
