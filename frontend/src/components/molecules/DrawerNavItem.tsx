'use client';

import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon
  from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import MailIcon from '@mui/icons-material/Mail';
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
