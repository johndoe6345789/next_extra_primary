'use client';

import { useCallback, useEffect, useState } from 'react';

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

/**
 * Manages the application color scheme via M3
 * CSS class toggling on the document root.
 * Sets 'light' or 'dark' class on <html>.
 *
 * When the current mode is 'system', toggling
 * resolves to 'dark' to establish an explicit
 * mode.
 *
 * @returns Theme mode state and controls.
 */
/** Detect OS preference via matchMedia. */
function getSystemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const mq = window.matchMedia(
    '(prefers-color-scheme: dark)',
  );
  return mq.matches ? 'dark' : 'light';
}

export function useThemeMode(): UseThemeModeReturn {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (
      localStorage.getItem('theme-mode') as Mode
    ) ?? 'light';
  });

  const [sysPref, setSysPref] = useState<
    'light' | 'dark'
  >(getSystemPref);

  useEffect(() => {
    const mq = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    const handler = (e: MediaQueryListEvent) => {
      setSysPref(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  const resolved = mode === 'system'
    ? sysPref
    : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    localStorage.setItem('theme-mode', mode);
  }, [mode, resolved]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
  }, []);

  const toggleMode = useCallback(() => {
    const next = resolved === 'dark'
      ? 'light'
      : 'dark';
    setMode(next);
  }, [resolved, setMode]);

  return { mode: resolved, setMode, toggleMode };
}

export default useThemeMode;
