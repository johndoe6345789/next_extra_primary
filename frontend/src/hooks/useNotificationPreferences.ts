'use client';

/**
 * Fetches and updates notification preferences.
 * @module hooks/useNotificationPreferences
 */
import {
  useGetNotifPrefsQuery,
  useUpdateNotifPrefsMutation,
  type NotifPrefs,
} from '@/store/api/notificationPrefsApi';

/** Return type for useNotificationPreferences. */
interface UseNotifPrefsReturn {
  /** Current preferences map. */
  prefs: NotifPrefs | undefined;
  /** Whether data is loading. */
  isLoading: boolean;
  /** Persist updated preferences. */
  save: (next: NotifPrefs) => Promise<void>;
}

/**
 * Provides notification preference state and
 * a save action backed by RTK Query.
 *
 * @returns Prefs state and save helper.
 */
export function useNotificationPreferences(
): UseNotifPrefsReturn {
  const { data: prefs, isLoading } =
    useGetNotifPrefsQuery();

  const [update] = useUpdateNotifPrefsMutation();

  const save = async (next: NotifPrefs) => {
    await update(next).unwrap();
  };

  return { prefs, isLoading, save };
}

export default useNotificationPreferences;
