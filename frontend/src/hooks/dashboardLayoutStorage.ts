/**
 * Persistence helpers for dashboard layout.
 * @module hooks/dashboardLayoutStorage
 */
import type {
  WidgetId, DashboardLayout,
} from '@/types/dashboard';
import registryJson from
  '@/constants/dashboard-widgets.json';

const STORAGE_KEY = 'nextra-dashboard-layout';

/** Build default layout from widget registry. */
export function defaultLayout(): DashboardLayout {
  return registryJson.map((w) => ({
    id: w.id as WidgetId,
    visible: true,
  }));
}

/** Read persisted layout or fall back to defaults. */
export function readLayout(): DashboardLayout {
  if (typeof window === 'undefined') {
    return defaultLayout();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLayout();
    return JSON.parse(raw) as DashboardLayout;
  } catch {
    return defaultLayout();
  }
}

/** Persist layout to localStorage. */
export function saveLayout(layout: DashboardLayout) {
  localStorage.setItem(
    STORAGE_KEY, JSON.stringify(layout),
  );
}
