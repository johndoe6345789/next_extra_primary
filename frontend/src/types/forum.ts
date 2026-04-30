/**
 * Forum domain types.
 * @module types/forum
 */

/** A forum thread list entry. */
export interface ForumThread {
  id: string;
  title: string;
  /** Board slug — e.g. "general", "support". */
  board?: string;
  /** Author UUID. */
  author?: string;
  /** Author display name (joined from users table). */
  authorName?: string;
  /** Total posts by this author (for rank display). */
  authorPostCount?: number;
  /** Opening post body. Only set on the detail
   *  endpoint; absent on the list endpoint. */
  body?: string;
  createdAt: string;
  /** Reply count. Optional on the detail response. */
  replyCount?: number;
  lastReplyAt?: string;
  lastReplyPreview?: string;
}

/** A single forum post inside a thread. */
export interface ForumPost {
  id: string;
  threadId: string;
  parentId?: string | null;
  /** Author UUID. */
  author?: string;
  /** Joined display name from users table. */
  authorName?: string;
  /** Total posts by this author (for rank display). */
  authorPostCount?: number;
  body: string;
  createdAt: string;
  depth?: number;
  reactions?: Record<string, number>;
}
