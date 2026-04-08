'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import List from '@shared/m3/List';
import type { Notification }
  from '@/types/notification';
import { NotificationItem }
  from './NotificationItem';

/** Props for NotificationList. */
export interface NotificationListProps {
  /** Notification items. */
  items: Notification[];
  /** Mark-as-read handler. */
  onRead: (id: string) => void;
  /** Empty state message. */
  emptyText: string;
}

/**
 * Renders the list of notification items
 * or an empty-state message.
 */
const NotificationList: React.FC<
  NotificationListProps
> = ({ items, onRead, emptyText }) => {
  if (items.length === 0) {
    return (
      <Typography
        color="text.secondary"
        variant="body2"
        data-testid="notif-empty"
      >
        {emptyText}
      </Typography>
    );
  }

  return (
    <List
      role="list"
      sx={{
        overflow: 'auto',
        maxHeight: 320,
      }}
    >
      {items.map((n) => (
        <NotificationItem
          key={n.id}
          item={n}
          onRead={onRead}
        />
      ))}
    </List>
  );
};

export default NotificationList;
