'use client';

import { useCallback } from 'react';
import { useColorScheme } from '@mui/material/styles';

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
 * Manages the application color scheme via MUI's
 * useColorScheme hook. Provides mode state and a
 * toggle helper that switches between light/dark.
 *
 * When the current mode is 'system', toggling
 * resolves to 'dark' to establish an explicit mode.
 *
 * @returns Theme mode state and controls.
 */
export function useThemeMode(): UseThemeModeReturn {
  const { mode, setMode } = useColorScheme();

  const resolved: Mode = (mode as Mode | undefined) ?? 'light';

  const toggleMode = useCallback(() => {
    const next = resolved === 'dark' ? 'light' : 'dark';
    setMode(next);
  }, [resolved, setMode]);

  return {
    mode: resolved,
    setMode: setMode as (m: Mode) => void,
    toggleMode,
  };
}

export default useThemeMode;
