'use client';

import React from 'react';
import ListItemButton from '@shared/m3/ListItemButton';
import ListItemIcon from '@shared/m3/ListItemIcon';
import ListItemText from '@shared/m3/ListItemText';
import DashboardIcon from '@shared/icons/Dashboard';
import LeaderboardIcon from '@shared/icons/EmojiEvents';
import ChatIcon from '@shared/icons/Chat';
import NotificationsIcon
  from '@shared/icons/Notifications';
import PersonIcon from '@shared/icons/Person';
import InfoIcon from '@shared/icons/Info';
import MailIcon from '@shared/icons/Mail';
import { Link } from '@/i18n/navigation';

/** Icon map for known routes. */
const ICONS: Record<string, React.ReactNode> = {
  '/dashboard': <DashboardIcon />,
  '/leaderboard': <LeaderboardIcon />,
  '/chat': <ChatIcon />,
  '/notifications': <NotificationsIcon />,
  '/profile': <PersonIcon />,
  '/about': <InfoIcon />,
  '/contact': <MailIcon />,
};

/** Props for DrawerNavItem. */
export interface DrawerNavItemProps {
  label: string;
  href: string;
  onClick: () => void;
}

/**
 * Styled nav item with icon for the mobile drawer.
 *
 * @param props - Component props.
 */
export const DrawerNavItem: React.FC<
  DrawerNavItemProps
> = ({ label, href, onClick }) => (
  <ListItemButton
    component={Link}
    href={href}
    role="menuitem"
    onClick={onClick}
    sx={{
      mx: 1,
      my: 0.5,
      borderRadius: 2,
      '&:hover': {
        bgcolor: 'action.hover',
      },
    }}
  >
    {ICONS[href] && (
      <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
        {ICONS[href]}
      </ListItemIcon>
    )}
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        fontWeight: 500,
      }}
    />
  </ListItemButton>
);

export default DrawerNavItem;
