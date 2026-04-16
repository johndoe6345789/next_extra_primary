'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/hooks';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import type { Notification } from '@/types/notification';
import NotificationList from './NotificationList';
import s from './NotificationPanel.module.scss';
import { Link } from '@/i18n/navigation';
import cfg from '@/constants/notifications.json';

/** Props for the NotificationPanel organism. */
export interface NotificationPanelProps {
  /** Whether the balloon is visible. */
  open: boolean;
  /** Close handler. */
  onClose: () => void;
  /** Test ID. */
  testId?: string;
}

/**
 * Notification balloon dropdown.
 *
 * @param props - Component props.
 */
export const NotificationPanel: React.FC<
  NotificationPanelProps
> = ({ open, onClose,
  testId = 'notif-panel' }) => {
  const t = useTranslations('notifications');
  const {
    notifications, markAsRead, markAllAsRead,
  } = useNotifications();

  useEscapeKey(open, onClose);

  if (!open) return null;

  const items =
    notifications as Notification[];
  return (
    <>
      <div
        className={s.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={s.balloon}
        role="dialog"
        aria-label="Notifications"
        data-testid={testId}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center', mb: 1,
        }}>
          <Typography variant="subtitle1">
            {t('title')}
          </Typography>
          <Button
            variant="text" size="small"
            onClick={markAllAsRead}
            data-testid="notif-mark-all"
          >
            {t('markAllRead')}
          </Button>
        </Box>
        <NotificationList
          items={
            items.slice(
              0, cfg.PANEL_PREVIEW_COUNT,
            )
          }
          onRead={markAsRead}
          emptyText={t('noNotifications')}
        />
        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <Button
            variant="text" size="small"
            component={Link}
            href="/notifications"
            onClick={onClose}
            data-testid="notif-view-all"
          >
            {t('viewAll')}
          </Button>
        </Box>
      </div>
    </>
  );
};

export default NotificationPanel;
