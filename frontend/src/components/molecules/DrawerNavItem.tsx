'use client';

import React from 'react';
import {
  Icon,
} from '@shared/m3/data-display/Icon';
import { Link } from '@/i18n/navigation';

/** Icon names for known routes. */
const ICONS: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/leaderboard': 'emoji_events',
  '/chat': 'chat',
  '/notifications': 'notifications',
  '/profile': 'person',
  '/about': 'info',
  '/contact': 'mail',
};

/** Props for DrawerNavItem. */
export interface DrawerNavItemProps {
  label: string;
  href: string;
  onClick: () => void;
}

/**
 * Nav item with icon for the mobile drawer.
 *
 * @param props - Component props.
 */
export const DrawerNavItem: React.FC<
  DrawerNavItemProps
> = ({ label, href, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    role="menuitem"
    className="list-item-button"
  >
    {ICONS[href] && (
      <span className="list-item-icon">
        <Icon size="sm" color="primary">
          {ICONS[href]}
        </Icon>
      </span>
    )}
    <span className="list-item-text">
      {label}
    </span>
  </Link>
);

export default DrawerNavItem;
