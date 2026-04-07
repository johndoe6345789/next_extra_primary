'use client';

import React, { useEffect, useCallback } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import List from '@shared/m3/List';
import { Button } from '../atoms';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/hooks';
import type { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import s from './NotificationPanel.module.scss';

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
> = ({ open, onClose, testId = 'notif-panel' }) => {
  const t = useTranslations('notifications');
  const {
    notifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onKey]);

  if (!open) return null;

  const items = notifications as Notification[];
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="subtitle1">
            {t('title')}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={markAllAsRead}
            testId="notif-mark-all"
          >
            {t('markAllRead')}
          </Button>
        </Box>
        {items.length === 0 ? (
          <Typography
            color="text.secondary"
            variant="body2"
            data-testid="notif-empty"
          >
            {t('noNotifications')}
          </Typography>
        ) : (
          <List
            role="list"
            sx={{ overflow: 'auto', maxHeight: 320 }}
          >
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                item={n}
                onRead={markAsRead}
              />
            ))}
          </List>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
