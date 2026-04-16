/**
 * Base RTK Query API definition.
 * Delegates auth-aware fetching to baseQueryReauth.
 * @module store/api/baseApi
 */
import { createApi } from
  '@reduxjs/toolkit/query/react';
import {
  baseQueryWithReauth,
} from './baseQueryReauth';

/** Root RTK Query API -- inject endpoints elsewhere. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth', 'User', 'Notification',
    'Gamification', 'Chat',
    'Dashboard', 'Features', 'Comments',
    'Translation', 'Preferences',
    'ApiKeys', 'SystemKeys', 'Admin',
    'Social',
    'Analytics', 'Flags',
    'ShopProducts', 'Cart', 'Orders',
  ],
  endpoints: () => ({}),
});
