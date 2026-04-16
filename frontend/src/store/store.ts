/**
 * Redux store configuration with RTK Query
 * and redux-persist.
 * @module store/store
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import gamificationReducer from './slices/gamificationSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';
import { persistConfig } from './persistConfig';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  notifications: notificationReducer,
  gamification: gamificationReducer,
  chat: chatReducer,
  ui: uiReducer,
  cart: cartReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

/** Shape of the combined root reducer. */
export type RootReducerState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Creates a new Redux store + persistor pair.
 * Used by StoreProvider for lazy initialization.
 */
export function makeStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
  });
  const persistor = persistStore(store);
  return { store, persistor };
}

/** Type of the store returned by makeStore. */
export type AppStore = ReturnType<typeof makeStore>['store'];

/** Inferred root state type. */
export type RootState = ReturnType<AppStore['getState']>;

/** Inferred dispatch type. */
export type AppDispatch = AppStore['dispatch'];
