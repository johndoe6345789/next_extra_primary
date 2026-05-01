/**
 * Base RTK Query API definition.
 *
 * Layered base query:
 *   rawBaseQuery → reauth (401 refresh) → retry (5xx
 *   and network errors with exponential backoff).
 * The retry layer absorbs the brief container-rebuild
 * windows so pages don't render empty when the backend
 * is mid-restart.
 *
 * @module store/api/baseApi
 */
import { createApi } from
  '@reduxjs/toolkit/query/react';
import {
  baseQueryWithRetry,
} from './baseQueryRetry';

/** Root RTK Query API -- inject endpoints elsewhere. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    'Auth', 'User', 'Notification',
    'Gamification', 'Chat',
    'Dashboard', 'Features', 'Comments',
    'Translation', 'Preferences',
    'ApiKeys', 'SystemKeys', 'Admin',
    'Social',
    'Analytics', 'Flags',
    'ShopProducts', 'Cart', 'Orders',
    'ForumBoards', 'Wiki', 'Gallery',
  ],
  endpoints: () => ({}),
});
