/**
 * Dashboard widget type definitions.
 * @module types/dashboard
 */

/** Unique identifier for each dashboard widget. */
export type WidgetId =
  | 'stats'
  | 'streak'
  | 'badges'
  | 'leaderboard'
  | 'progress'
  | 'points';

/** Grid column span for a widget. */
export type WidgetSpan = 4 | 6 | 8 | 12;

/** Static metadata for a registered widget. */
export interface WidgetDef {
  /** Unique widget identifier. */
  readonly id: WidgetId;
  /** i18n key within the dashboard namespace. */
  readonly labelKey: string;
  /** Default grid column span (out of 12). */
  readonly defaultSpan: WidgetSpan;
}

/** Per-user layout entry stored in localStorage. */
export interface WidgetLayoutItem {
  /** Widget identifier. */
  readonly id: WidgetId;
  /** Whether the widget is currently visible. */
  readonly visible: boolean;
}

/** Full persisted dashboard layout. */
export type DashboardLayout = WidgetLayoutItem[];
