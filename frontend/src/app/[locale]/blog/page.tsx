'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { Pagination } from '@shared/m3/navigation';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogCard } from '@/components/molecules/BlogCard';
import content from '@/constants/content.json';

/**
 * Blog post list page with pagination.
 *
 * @returns Blog index page UI.
 */
export default function BlogPage(): React.ReactElement {
  const t = useTranslations('blog');
  const [page, setPage] = useState(1);
  const { posts, total, isLoading, error } =
    useBlogPosts(page, content.blog.pageSize);
  const pageCount = Math.ceil(
    total / content.blog.pageSize,
  );

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      data-testid="blog-page"
      sx={{ maxWidth: 860, mx: 'auto' }}
    >
      {/* Heading */}
      <Box sx={{
        mb: 4,
        animation: 'gallery-fade-in 0.4s ease both',
      }}>
        <Typography variant="h3" component="h1"
          fontWeight={700}
          sx={{
            letterSpacing: '-0.02em', mb: 0.5,
            color: 'primary.dark',
          }}>
          {t('title')}
        </Typography>
        {!isLoading && !error && total > 0 && (
          <Typography variant="body2"
            sx={{ color: 'text.secondary' }}>
            {total} {t('posts')}
          </Typography>
        )}
      </Box>

      {isLoading && (
        <Box sx={{
          display: 'flex', justifyContent: 'center',
          py: 8,
        }} data-testid="blog-loading">
          <CircularProgress aria-label={t('loading')} />
        </Box>
      )}
      {error && (
        <Typography color="error"
          data-testid="blog-error">
          {error}
        </Typography>
      )}

      {/* Post cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
        {posts.map((post, i) => (
          <BlogCard key={post.id} post={post}
            animDelay={i * 0.07} />
        ))}
      </Box>

      {pageCount > 1 && (
        <Box sx={{ mt: 4, display: 'flex',
          justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={setPage}
            aria-label={t('pagination')}
            data-testid="blog-pagination"
          />
        </Box>
      )}
    </Box>
  );
}
