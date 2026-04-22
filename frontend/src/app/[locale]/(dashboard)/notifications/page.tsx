'use client';

/**
 * Full paginated notifications list page.
 * @module app/[locale]/(dashboard)/notifications/page
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from '@/store/api/notificationApi';
import NotificationList
  from '@/components/organisms/NotificationList';
import { useMarkAsReadMutation }
  from '@/store/api/notificationApi';
import cfg from '@/constants/notifications.json';

/** Paginated notifications list. */
export default function NotificationsPage(): React.ReactElement {
  const t = useTranslations('notifications');
  const [page, setPage] = useState(1);

  const { data, isLoading } =
    useGetNotificationsQuery({
      page,
      perPage: cfg.PAGE_SIZE,
    });

  const [markRead] = useMarkAsReadMutation();
  const [markAll] = useMarkAllAsReadMutation();

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const hasMore =
    page * cfg.PAGE_SIZE < total;

  return (
    <Box
      aria-label={t('title')}
      data-testid="notifications-page"
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', mb: 2,
      }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        <Button
          variant="text"
          onClick={() => markAll()}
          data-testid="notif-page-mark-all"
        >
          {t('markAllRead')}
        </Button>
      </Box>
      {isLoading
        ? <Typography>{t('loading')}</Typography>
        : (
          <NotificationList
            items={items}
            onRead={(id) => { markRead(id); }}
            emptyText={t('noNotifications')}
          />
        )}
      {hasMore && (
        <Button
          variant="outlined"
          onClick={() => setPage((p) => p + 1)}
          data-testid="notif-load-more"
          sx={{ mt: 2 }}
        >
          {t('loadMore')}
        </Button>
      )}
    </Box>
  );
}
