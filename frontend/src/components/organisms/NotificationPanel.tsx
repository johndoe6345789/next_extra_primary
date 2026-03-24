'use client';

import React, { useCallback, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { Button } from '../atoms';
import { useNotifications } from '@/hooks';
import type { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';

/** Props for the NotificationPanel organism. */
export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  testId?: string;
}

/**
 * Right-side drawer with notifications.
 * Escape closes. Mark one or all read.
 *
 * @param props - Component props.
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  onClose,
  testId = 'notif-panel',
}) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
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

  const items = notifications as Notification[];
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      data-testid={testId}
      aria-label="Notifications panel"
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Button
            variant="text"
            size="small"
            onClick={markAllAsRead}
            testId="notif-mark-all"
          >
            Mark all read
          </Button>
        </Box>
        {items.length === 0 ? (
          <Typography color="text.secondary" data-testid="notif-empty">
            No notifications
          </Typography>
        ) : (
          <List role="list">
            {items.map((n) => (
              <NotificationItem key={n.id} item={n} onRead={markAsRead} />
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};
