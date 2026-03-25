'use client';

import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import type { Notification } from '@/types/notification';

const ICONS: Record<string, React.ReactNode> = {
  achievement: <EmojiEventsIcon />,
  system: <InfoIcon />,
  social: <ChatIcon />,
  chat: <ChatIcon />,
  streak: <EmojiEventsIcon />,
};

/** Props for NotificationItem. */
export interface NotificationItemProps {
  /** Notification data. */
  item: Notification;
  /** Mark as read handler. */
  onRead: (id: string) => void;
}

/**
 * Single notification list item with icon.
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onRead,
}) => (
  <ListItemButton
    tabIndex={0}
    onClick={() => onRead(item.id)}
    data-testid={`notif-${item.id}`}
    sx={{ opacity: item.read ? 0.6 : 1 }}
  >
    <ListItemIcon>{ICONS[item.type] ?? <InfoIcon />}</ListItemIcon>
    <ListItemText primary={item.title} secondary={item.body} />
  </ListItemButton>
);

export default NotificationItem;
