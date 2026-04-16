'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Pagination,
} from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useBlogPosts } from '@/hooks/useBlogPosts';
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
      sx={{ p: 3, maxWidth: 860, mx: 'auto' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      {isLoading && (
        <Typography data-testid="blog-loading">
          {t('loading')}
        </Typography>
      )}
      {error && (
        <Typography color="error" data-testid="blog-error">
          {error}
        </Typography>
      )}
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardActionArea
            component={Link}
            href={`/blog/${post.slug}`}
            aria-label={post.title}
            data-testid={`blog-card-${post.id}`}
          >
            <CardContent>
              <Typography variant="h6">
                {post.title}
              </Typography>
              {post.excerpt && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {post.excerpt}
                </Typography>
              )}
              {post.publishedAt && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                >
                  {new Date(
                    post.publishedAt,
                  ).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => setPage(p)}
          aria-label={t('pagination')}
          data-testid="blog-pagination"
        />
      )}
    </Box>
  );
}
