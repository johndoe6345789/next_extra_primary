'use client';

import { useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  getDebugEntries,
  subscribe,
  clearDebugEntries,
  type DebugEntry,
} from '@/utils/debugStore';

/** Data exposed by the debug panel hook. */
export interface DebugPanelData {
  /** Recent API call entries. */
  entries: DebugEntry[];
  /** Auth state summary. */
  auth: {
    isAuthenticated: boolean;
    role: string;
    userId: string;
  };
  /** Frontend build info. */
  env: {
    apiUrl: string;
    basePath: string;
    nodeEnv: string;
  };
  /** Clear all debug entries. */
  clear: () => void;
}

/**
 * Provides debug telemetry data for the admin
 * debug panel.
 *
 * @returns Debug panel data and controls.
 */
export function useDebugPanel(): DebugPanelData {
  const entries = useSyncExternalStore(
    subscribe,
    getDebugEntries,
    getDebugEntries,
  );

  const auth = useSelector((s: RootState) => ({
    isAuthenticated: s.auth.isAuthenticated,
    role: s.auth.user?.role ?? 'none',
    userId: s.auth.user?.id ?? '',
  }));

  const env = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
    basePath:
      process.env.NEXT_PUBLIC_BASE_PATH ?? '',
    nodeEnv:
      process.env.NODE_ENV ?? 'unknown',
  };

  return { entries, auth, env, clear: clearDebugEntries };
}
