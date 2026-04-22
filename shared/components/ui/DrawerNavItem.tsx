'use client';

import React from 'react';
import {
  Icon,
} from '../m3/data-display/Icon';
import { useLink } from './LinkContext';
import NAV_ICONS from
  '../../constants/nav-icons.json';

/** Icon names for known routes. */
const ICONS: Record<string, string> =
  NAV_ICONS as Record<string, string>;

/** Props for DrawerNavItem. */
export interface DrawerNavItemProps {
  label: string;
  href: string;
  onClick: () => void;
}

/**
 * Nav item with icon for the drawer.
 * Uses LinkContext for routing.
 *
 * @param props - Component props.
 */
export const DrawerNavItem: React.FC<
  DrawerNavItemProps
> = ({ label, href, onClick }) => {
  const Link = useLink();
  return (
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
};

export default DrawerNavItem;
