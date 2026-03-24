/**
 * Redux store configuration with RTK Query
 * and redux-persist.
 * @module store/store
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
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
import { persistConfig } from './persistConfig';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  notifications: notificationReducer,
  gamification: gamificationReducer,
  chat: chatReducer,
  ui: uiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

/** Shape of the combined root reducer. */
export type RootReducerState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

/** Configured Redux store instance. */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

/** Inferred root state type. */
export type RootState = ReturnType<typeof store.getState>;

/** Inferred dispatch type. */
export type AppDispatch = typeof store.dispatch;
