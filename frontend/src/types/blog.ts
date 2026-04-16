/**
 * Blog domain types.
 * @module types/blog
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
