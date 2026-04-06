/**
 * Manages dashboard widget layout in localStorage.
 * @module hooks/useDashboardLayout
 */
'use client';

import { useState, useCallback } from 'react';
import type { WidgetId } from '@/types/dashboard';
import {
  defaultLayout, readLayout, saveLayout,
} from './dashboardLayoutStorage';

/** Return type for the useDashboardLayout hook. */
export interface UseDashboardLayoutReturn {
  /** Ordered list of widgets with visibility. */
  layout: ReturnType<typeof readLayout>;
  /** Move a widget from one index to another. */
  reorder: (from: number, to: number) => void;
  /** Toggle a widget's visibility. */
  toggle: (id: WidgetId) => void;
  /** Reset to default layout. */
  reset: () => void;
}

/**
 * Hook for managing dashboard widget layout.
 * Persists order and visibility to localStorage.
 */
export function useDashboardLayout():
    UseDashboardLayoutReturn {
  const [layout, setLayout] = useState(readLayout);

  const persist = useCallback(
    (next: ReturnType<typeof readLayout>) => {
      setLayout(next);
      saveLayout(next);
    }, [],
  );

  const reorder = useCallback(
    (from: number, to: number) => {
      setLayout((prev) => {
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        saveLayout(next);
        return next;
      });
    }, [],
  );

  const toggle = useCallback(
    (id: WidgetId) => {
      setLayout((prev) => {
        const next = prev.map((w) =>
          w.id === id
            ? { ...w, visible: !w.visible }
            : w,
        );
        saveLayout(next);
        return next;
      });
    }, [],
  );

  const reset = useCallback(() => {
    persist(defaultLayout());
  }, [persist]);

  return { layout, reorder, toggle, reset };
}
