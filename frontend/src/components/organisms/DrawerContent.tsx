'use client';

import React from 'react';
import List from '@shared/m3/List';
import Divider from '@shared/m3/Divider';
import {
  DrawerNavItem,
} from '@shared/components/ui/DrawerNavItem';
import { DrawerFooter } from
  '../molecules/DrawerFooter';
import { DrawerToolLinks } from
  '../molecules/DrawerToolLinks';
import { DrawerSearch } from
  '../molecules/DrawerSearch';
import type { NavLink } from './MobileDrawer';

/** Props for DrawerContent. */
export interface DrawerContentProps {
  /** Navigation links. */
  links: NavLink[];
  /** Search callback. */
  onSearch: (q: string) => void;
  /** Close the drawer on link click. */
  onClose: () => void;
}

/**
 * Scrollable drawer body: search, nav links,
 * tool links, and footer with theme toggle
 * and locale switcher.
 *
 * @param props - Component props.
 */
export const DrawerContent: React.FC<
  DrawerContentProps
> = ({ links, onSearch, onClose }) => (
  <>
    <div style={{
      flex: 1, overflowY: 'auto',
    }}>
      <DrawerSearch onSearch={onSearch} />
      <Divider />
      <List sx={{ py: 1 }} role="menu">
        {links.map((l) => (
          <DrawerNavItem
            key={l.href}
            label={l.label}
            href={l.href}
            onClick={onClose}
          />
        ))}
      </List>
      <Divider />
      <DrawerToolLinks excludeUrls={['/app']} />
      <Divider />
      <DrawerFooter />
    </div>
  </>
);

export default DrawerContent;
