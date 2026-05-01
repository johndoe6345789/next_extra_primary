'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import type { BlogPostSummary } from '@/types/content';

/** Props for BlogCard. */
export interface BlogCardProps {
  /** Post data to display. */
  post: BlogPostSummary;
  /** Stagger delay for entrance animation (seconds). */
  animDelay?: number;
}

/**
 * Styled blog post card with accent bar, hover lift,
 * and staggered entrance animation.
 *
 * @param props - BlogCard props.
 * @returns Linked card for a blog post summary.
 */
export function BlogCard({
  post, animDelay = 0,
}: BlogCardProps): React.ReactElement {
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        undefined,
        { year: 'numeric', month: 'short', day: 'numeric' },
      )
    : null;

  return (
    <Box
      component={Link}
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      data-testid={`blog-card-${post.id}`}
      sx={{
        display: 'flex', textDecoration: 'none',
        borderRadius: 3, overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        animation:
          'gallery-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay: `${animDelay}s`,
        transition: 'box-shadow 0.25s ease, ' +
          'border-color 0.25s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.11)',
          borderColor: 'primary.light',
        },
      }}
    >
      {/* Accent bar — narrow, gentle primary tint */}
      <Box sx={{
        width: 3, flexShrink: 0,
        bgcolor: 'primary.main',
        opacity: 0.35,
      }} />
      <Box sx={{ p: 2.5, flex: 1, minWidth: 0 }}>
        <Typography variant="h6" fontWeight={600}
          sx={{
            lineHeight: 1.3, mb: 0.75,
            color: 'text.primary',
          }}>
          {post.title}
        </Typography>
        {post.excerpt && (
          <Typography variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
            {post.excerpt}
          </Typography>
        )}
        {dateStr && (
          <Typography variant="caption"
            sx={{
              color: 'text.disabled',
              letterSpacing: '0.04em',
            }}>
            {dateStr}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default BlogCard;
