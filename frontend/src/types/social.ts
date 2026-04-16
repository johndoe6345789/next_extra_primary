/**
 * TypeScript types for social feature API responses.
 * @module types/social
 */

/** Follower/following counts + list. */
export interface FollowCounts {
  /** Total count. */
  count: number;
  /** Whether the current user follows this target. */
  isFollowing?: boolean;
}

/** A direct message thread. */
export interface DmThread {
  /** Thread ID. */
  id: string;
  /** Other participant handle. */
  participantHandle: string;
  /** Other participant display name. */
  participantName: string;
  /** Other participant avatar URL. */
  participantAvatar?: string;
  /** Last message preview. */
  lastMessage?: string;
  /** ISO timestamp of last message. */
  lastMessageAt?: string;
  /** Count of unread messages. */
  unreadCount: number;
}

/** A direct message. */
export interface DmMessage {
  /** Message ID. */
  id: string;
  /** Sender user ID. */
  senderId: string;
  /** Message content. */
  content: string;
  /** ISO timestamp. */
  createdAt: string;
}

/** User presence data. */
export interface Presence {
  /** User ID. */
  userId: string;
  /** Whether the user is online. */
  online: boolean;
  /** ISO timestamp of last seen. */
  lastSeen?: string;
}

/** A single emoji reaction. */
export interface Reaction {
  /** Emoji character. */
  emoji: string;
  /** Number of users who reacted. */
  count: number;
  /** Whether the current user added this reaction. */
  reacted: boolean;
}

/** A mention of the current user. */
export interface Mention {
  /** Mention ID. */
  id: string;
  /** Mentioning user's handle. */
  authorHandle: string;
  /** Context snippet. */
  excerpt: string;
  /** ISO timestamp. */
  createdAt: string;
  /** Whether it has been read. */
  read: boolean;
  /** Source type (post, comment, etc.). */
  sourceType: string;
  /** Source entity ID. */
  sourceId: string;
}
