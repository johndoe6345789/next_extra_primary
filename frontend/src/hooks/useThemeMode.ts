'use client';

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '@/store/api/preferencesApi';
import type {
  Mode, UseThemeModeReturn,
} from './themeModeTypes';
import { getSystemPref } from './themeModeTypes';
import {
  useSyncPreference,
  useSystemPrefListener,
  useApplyTheme,
} from './useThemeModeEffects';

/**
 * Manages the application color scheme.
 * Syncs preference with the backend when
 * the user is authenticated.
 *
 * @returns Theme mode state and controls.
 */
export function useThemeMode(
): UseThemeModeReturn {
  const loggedIn = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );
  const { data: prefs } =
    useGetPreferencesQuery(
      undefined, { skip: !loggedIn },
    );
  const [savePref] =
    useUpdatePreferencesMutation();

  const [mode, setModeState] =
    useState<Mode>(() => {
      if (typeof window === 'undefined') {
        return 'light';
      }
      return (
        localStorage.getItem(
          'theme-mode',
        ) as Mode
      ) ?? 'light';
    });

  const [sysPref, setSysPref] = useState<
    'light' | 'dark'
  >(getSystemPref);

  useSyncPreference(prefs?.themeMode, setModeState);
  useSystemPrefListener(setSysPref);

  const resolved = mode === 'system'
    ? sysPref : mode;

  useApplyTheme(mode, resolved);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    if (loggedIn) savePref({ themeMode: m });
  }, [loggedIn, savePref]);

  const toggleMode = useCallback(() => {
    const next = resolved === 'dark'
      ? 'light' : 'dark';
    setMode(next);
  }, [resolved, setMode]);

  return {
    mode: resolved, setMode, toggleMode,
  };
}

export default useThemeMode;
