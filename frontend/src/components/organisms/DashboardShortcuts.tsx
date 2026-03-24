'use client';

import React, { useState, useCallback } from 'react';
import { useGlobalShortcuts, useKeyboardShortcuts } from '@/hooks';
import { ShortcutCheatSheet } from './ShortcutCheatSheet';

/** Props for the DashboardShortcuts component. */
export interface DashboardShortcutsProps {
  /** Callback when `/` is pressed to focus search. */
  onFocusSearch?: () => void;
}

/**
 * Invisible client component that registers global
 * keyboard shortcuts and renders the `?` cheat sheet
 * dialog. Drop into a server-component layout to wire
 * shortcuts without making the layout a client component.
 *
 * @param props - Optional search focus callback.
 * @returns The cheat sheet dialog (or null).
 */
export function DashboardShortcuts({
  onFocusSearch,
}: DashboardShortcutsProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  useGlobalShortcuts({ onFocusSearch });
  useKeyboardShortcuts({ '?': toggle });

  return <ShortcutCheatSheet open={open} onClose={close} />;
}

export default DashboardShortcuts;
