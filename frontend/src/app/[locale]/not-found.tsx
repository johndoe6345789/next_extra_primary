'use client';

import type { ReactElement } from 'react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Button,
} from '@metabuilder/m3';

/**
 * Custom 404 page for locale-scoped routes.
 *
 * Displays a user-friendly message and a link
 * back to the home page. Uses `useTranslations`
 * for localised copy when available.
 *
 * @returns Not-found UI with navigation link.
 */
export default function NotFound(): ReactElement {
  const t = useTranslations('NotFound');

  return (
    <Box
      component="main"
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{ fontSize: '6rem', fontWeight: 700 }}
        aria-label={t('statusCode', { defaultValue: '404' })}
      >
        404
      </Typography>
      <Typography variant="h5" component="p">
        {t('title', {
          defaultValue: 'Page not found',
        })}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('description', {
          defaultValue: 'The page you are looking for' + ' does not exist.',
        })}
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        size="large"
        aria-label={t('homeLink', {
          defaultValue: 'Return to home page',
        })}
      >
        {t('homeLink', {
          defaultValue: 'Go Home',
        })}
      </Button>
    </Box>
  );
}
