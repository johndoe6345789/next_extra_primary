/**
 * Forum board configuration types.
 * @module types/forumBoard
 */

/** A forum board returned by GET /api/forum/boards. */
export interface ForumBoard {
  /** URL-safe identifier. */
  slug: string;
  /** Human-readable board name. */
  label: string;
  /** Short description shown in listing. */
  description: string;
  /** Material icon name for the board. */
  icon: string;
  /** Whether users must be signed in to access. */
  requiresAuth: boolean;
  /** Minimum post count required to access. */
  minPosts: number;
  /** Whether unauthenticated visitors can see the board. */
  isGuestVisible: boolean;
  /** Display order (lower = earlier). */
  sortOrder: number;
}

/**
 * Subset of ForumBoard fields that admins
 * may update via PUT /api/forum/boards/:slug.
 */
export type ForumBoardPatch = Partial<Pick<ForumBoard,
  | 'requiresAuth'
  | 'minPosts'
  | 'isGuestVisible'
  | 'label'
  | 'description'
>>;
