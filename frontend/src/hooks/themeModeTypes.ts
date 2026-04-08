/**
 * Types and helpers for the useThemeMode hook.
 * @module hooks/themeModeTypes
 */

/** Supported theme mode values. */
export type Mode = 'light' | 'dark' | 'system';

/** Return type for the useThemeMode hook. */
export interface UseThemeModeReturn {
  /** Current resolved mode. */
  mode: Mode;
  /** Set a specific mode. */
  setMode: (mode: Mode) => void;
  /** Toggle between light and dark mode. */
  toggleMode: () => void;
}

/**
 * Detect OS color-scheme preference.
 *
 * @returns 'dark' if the OS prefers dark mode.
 */
export function getSystemPref():
  'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches ? 'dark' : 'light';
}
