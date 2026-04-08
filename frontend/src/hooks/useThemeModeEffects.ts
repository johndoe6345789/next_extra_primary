'use client';

/**
 * Side-effect hooks used by useThemeMode.
 * @module hooks/useThemeModeEffects
 */
import {
  useEffect, type Dispatch,
  type SetStateAction,
} from 'react';
import type { Mode } from './themeModeTypes';

/**
 * Syncs local mode state with the backend
 * preference when it arrives.
 *
 * @param themeMode - Mode from server prefs.
 * @param setMode - Local mode setter.
 */
export function useSyncPreference(
  themeMode: Mode | undefined,
  setMode: Dispatch<SetStateAction<Mode>>,
): void {
  useEffect(() => {
    if (themeMode) setMode(themeMode);
  }, [themeMode, setMode]);
}

/**
 * Listens for OS color-scheme changes and
 * updates the system preference state.
 *
 * @param setSysPref - System pref setter.
 */
export function useSystemPrefListener(
  setSysPref: Dispatch<
    SetStateAction<'light' | 'dark'>
  >,
): void {
  useEffect(() => {
    const mq = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    const h = (e: MediaQueryListEvent) =>
      setSysPref(
        e.matches ? 'dark' : 'light',
      );
    mq.addEventListener('change', h);
    return () =>
      mq.removeEventListener('change', h);
  }, [setSysPref]);
}

/**
 * Applies the resolved mode to the document
 * root class list and persists to localStorage.
 *
 * @param mode - Raw mode value.
 * @param resolved - Resolved light or dark.
 */
export function useApplyTheme(
  mode: Mode,
  resolved: 'light' | 'dark',
): void {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    localStorage.setItem(
      'theme-mode', mode,
    );
  }, [mode, resolved]);
}
