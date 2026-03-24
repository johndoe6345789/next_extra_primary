'use client';

import { useMemo } from 'react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useThemeMode } from './useThemeMode';
import { useRouter } from '@/i18n/navigation';
import routes from '@/constants/routes.json';
import type { ShortcutMap } from './useKeyboardShortcuts';

/** Props for the useGlobalShortcuts hook. */
export interface GlobalShortcutOptions {
  /**
   * Callback invoked when the user presses `/`
   * to focus the search bar.
   */
  onFocusSearch?: () => void;
}

/**
 * Wires all global keyboard shortcuts defined in
 * `keyboard-shortcuts.json`. Handles theme toggle,
 * navigation, and an optional search-focus callback.
 *
 * Escape is intentionally omitted here; individual
 * modals and panels handle it locally.
 *
 * @param options - Optional callbacks for shortcuts.
 */
export function useGlobalShortcuts(options: GlobalShortcutOptions = {}): void {
  const { toggleMode } = useThemeMode();
  const router = useRouter();
  const { onFocusSearch } = options;

  const shortcuts: ShortcutMap = useMemo(
    () => ({
      '/': () => onFocusSearch?.(),
      'ctrl+shift+d': () => toggleMode(),
      'ctrl+h': () => router.push(routes.dashboard),
      'ctrl+shift+n': () => {
        router.push(routes.notifications);
      },
      'ctrl+j': () => router.push(routes.chat),
    }),
    [onFocusSearch, toggleMode, router],
  );

  useKeyboardShortcuts(shortcuts);
}

export default useGlobalShortcuts;
