/**
 * Widget registry helpers for span and label lookup.
 * @module components/organisms/widgets/widgetRegistry
 */
import type { WidgetId } from '@/types/dashboard';
import registryJson from
  '@/constants/dashboard-widgets.json';

/** Valid MUI Grid column span. */
type FlexCol =
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Span lookup from the registry JSON. */
export const spanMap = Object.fromEntries(
  registryJson.map((w) => [w.id, w.defaultSpan]),
) as Record<WidgetId, FlexCol>;

/** Label key lookup from the registry JSON. */
export const labelMap = Object.fromEntries(
  registryJson.map((w) => [w.id, w.labelKey]),
) as Record<WidgetId, string>;
