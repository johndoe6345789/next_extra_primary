import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminForumBoards from
  '@/components/organisms/AdminForumBoards';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the admin forum boards page. */
interface ForumPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Admin page for configuring forum board settings:
 * visibility, auth requirements, and access thresholds.
 *
 * @param props - Page props with locale.
 * @returns Forum board administration interface.
 */
export default async function AdminForumPage({
  params,
}: ForumPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label={t('forumBoards')}
      data-testid="admin-forum-page"
      sx={{ p: 3, maxWidth: 960, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('forumBoards')}
      </Typography>
      <Typography
        variant="body2" color="text.secondary"
        gutterBottom
      >
        {t('forumBoardsDesc')}
      </Typography>
      <RoleGuard required="admin">
        <AdminForumBoards />
      </RoleGuard>
    </Box>
  );
}
