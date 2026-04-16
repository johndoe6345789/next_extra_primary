/**
 * Forum domain types.
 * @module types/forum
 */

/** A forum thread list entry. */
export interface ForumThread {
  id: string;
  title: string;
  author?: string;
  createdAt: string;
  replyCount: number;
  lastReplyAt?: string;
  lastReplyPreview?: string;
}

/** A single forum post inside a thread. */
export interface ForumPost {
  id: string;
  threadId: string;
  parentId?: string | null;
  author?: string;
  body: string;
  createdAt: string;
  depth?: number;
  reactions?: Record<string, number>;
}
