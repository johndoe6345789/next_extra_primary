'use client';

import React from 'react';
import ListItemButton from '@metabuilder/m3/ListItemButton';
import ListItemIcon from '@metabuilder/m3/ListItemIcon';
import ListItemText from '@metabuilder/m3/ListItemText';
import DashboardIcon from '@metabuilder/icons/Dashboard';
import LeaderboardIcon from '@metabuilder/icons/EmojiEvents';
import ChatIcon from '@metabuilder/icons/Chat';
import NotificationsIcon
  from '@metabuilder/icons/Notifications';
import PersonIcon from '@metabuilder/icons/Person';
import InfoIcon from '@metabuilder/icons/Info';
import MailIcon from '@metabuilder/icons/Mail';
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
