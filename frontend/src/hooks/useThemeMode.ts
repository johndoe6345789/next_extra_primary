'use client';

import {
  useCallback, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '@/store/api/preferencesApi';

/** Supported theme mode values. */
type Mode = 'light' | 'dark' | 'system';

/** Return type for the useThemeMode hook. */
interface UseThemeModeReturn {
  /** Current resolved mode. */
  mode: Mode;
  /** Set a specific mode. */
  setMode: (mode: Mode) => void;
  /** Toggle between light and dark mode. */
  toggleMode: () => void;
}

/** Detect OS preference via matchMedia. */
function getSystemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches ? 'dark' : 'light';
}

/**
 * Manages the application color scheme.
 * Syncs preference with the backend when
 * the user is authenticated.
 *
 * @returns Theme mode state and controls.
 */
export function useThemeMode(): UseThemeModeReturn {
  const loggedIn = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );
  const { data: prefs } = useGetPreferencesQuery(
    undefined, { skip: !loggedIn },
  );
  const [savePref] =
    useUpdatePreferencesMutation();

  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (
      localStorage.getItem('theme-mode') as Mode
    ) ?? 'light';
  });

  const [sysPref, setSysPref] = useState<
    'light' | 'dark'
  >(getSystemPref);

  /* Apply backend preference on login. */
  useEffect(() => {
    if (prefs?.themeMode) {
      setModeState(prefs.themeMode);
    }
  }, [prefs?.themeMode]);

  /* Track OS dark mode changes. */
  useEffect(() => {
    const mq = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    const h = (e: MediaQueryListEvent) =>
      setSysPref(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const resolved = mode === 'system'
    ? sysPref : mode;

  /* Apply class + persist locally. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    localStorage.setItem('theme-mode', mode);
  }, [mode, resolved]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    if (loggedIn) savePref({ themeMode: m });
  }, [loggedIn, savePref]);

  const toggleMode = useCallback(() => {
    const next = resolved === 'dark'
      ? 'light' : 'dark';
    setMode(next);
  }, [resolved, setMode]);

  return { mode: resolved, setMode, toggleMode };
}

export default useThemeMode;
