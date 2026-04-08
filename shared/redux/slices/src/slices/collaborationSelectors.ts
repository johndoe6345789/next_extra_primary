/**
 * Selectors for collaboration state
 */

import type {
  ActivityFeedEntry,
  ConflictItem
} from '../types/project';

/** Collaboration state shape */
interface CollaborationState {
  activityFeed: ActivityFeedEntry[];
  conflicts: ConflictItem[];
  isActivityLoading: boolean;
  hasUnresolvedConflicts: boolean;
}

/** Select activity feed entries */
export const selectActivityFeed = (
  state: { collaboration: CollaborationState }
) => state.collaboration.activityFeed;

/** Select activity loading status */
export const selectActivityLoading = (
  state: { collaboration: CollaborationState }
) => state.collaboration.isActivityLoading;

/** Select conflict items */
export const selectConflicts = (
  state: { collaboration: CollaborationState }
) => state.collaboration.conflicts;

/** Select unresolved conflicts flag */
export const selectHasUnresolvedConflicts = (
  state: { collaboration: CollaborationState }
) => state.collaboration.hasUnresolvedConflicts;

/** Select conflict count */
export const selectConflictCount = (
  state: { collaboration: CollaborationState }
) => state.collaboration.conflicts.length;

/** Select conflict by item ID */
export const selectConflictByItemId = (
  state: { collaboration: CollaborationState },
  itemId: string
) =>
  state.collaboration.conflicts.find(
    (c) => c.itemId === itemId
  );
