'use client';

import { useCallback, useEffect, useState } from 'react';
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

  // Always start with the same value on server and client
  // so the first paint matches SSR. Reading localStorage in
  // useState's initializer caused a hydration mismatch
  // because SSR can't see localStorage. Pull the persisted
  // value in useEffect after mount instead.
  const [mode, setModeState] = useState<Mode>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode') as Mode | null;
    if (stored && stored !== mode) {
      setModeState(stored);
    }
    // Intentionally only run on mount. We just want to swap
    // from the SSR default to the persisted preference once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same SSR-safe pattern as `mode` — start with 'light',
  // sync to the actual system preference after mount.
  const [sysPref, setSysPref] = useState<
    'light' | 'dark'
  >('light');

  useEffect(() => {
    setSysPref(getSystemPref());
  }, []);

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
