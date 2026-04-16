/**
 * Shared content domain types.
 * @module types/content
 */

/** A blog post summary for list views. */
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  coverImage?: string;
}

/** A full blog post for detail views. */
export interface BlogPost extends BlogPostSummary {
  contentMarkdown: string;
  tags?: string[];
  description?: string;
}

/** A wiki tree node for sidebar navigation. */
export interface WikiTreeNode {
  slug: string;
  title: string;
  children?: WikiTreeNode[];
}

/** A rendered wiki page. */
export interface WikiPage {
  slug: string;
  title: string;
  contentHtml: string;
  updatedAt?: string;
  updatedBy?: string;
  revision?: number;
}

/** A wiki revision meta entry. */
export interface WikiRevision {
  id: string;
  revision: number;
  author?: string;
  createdAt: string;
  summary?: string;
}

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

/** An active poll. */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  voted?: boolean;
}

/** A single poll option. */
export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

/** A gallery album. */
export interface Album {
  id: string;
  title: string;
  description?: string;
  coverPhotoId?: string;
  photoCount: number;
}

/** A photo inside an album with variants. */
export interface Photo {
  id: string;
  albumId: string;
  title?: string;
  caption?: string;
  variants: Record<string, string>;
}
