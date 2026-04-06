/**
 * Maps widget IDs to their React components.
 * @module components/organisms/widgets/widgetMap
 */
import type { ComponentType } from 'react';
import type { WidgetId } from '@/types/dashboard';
import StatsWidget from './StatsWidget';
import StreakWidget from './StreakWidget';
import ProgressWidget from './ProgressWidget';
import PointsWidget from './PointsWidget';
import BadgesWidget from './BadgesWidget';
import LeaderboardWidget from './LeaderboardWidget';

/** Map from widget ID to its render component. */
export const widgetMap: Record<
  WidgetId, ComponentType
> = {
  stats: StatsWidget,
  streak: StreakWidget,
  progress: ProgressWidget,
  points: PointsWidget,
  badges: BadgesWidget,
  leaderboard: LeaderboardWidget,
};
