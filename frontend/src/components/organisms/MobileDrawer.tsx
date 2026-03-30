'use client';

import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Link } from '@/i18n/navigation';
import { DrawerHeader } from '../molecules/DrawerHeader';
import { DrawerNavItem } from '../molecules/DrawerNavItem';
import { DrawerFooter } from '../molecules/DrawerFooter';
import { DrawerToolLinks } from '../molecules/DrawerToolLinks';
import { BurgerButton } from '../atoms/BurgerButton';

/** Navigation link shape. */
export interface NavLink {
  label: string;
  href: string;
}

/** Props for MobileDrawer. */
export interface MobileDrawerProps {
  /** Navigation links. */
  links: NavLink[];
}

/**
 * Slide-out drawer for xs/sm viewports. Branded
 * header, icon nav links, theme + locale footer.
 *
 * @param props - Component props.
 */
export const MobileDrawer: React.FC<
  MobileDrawerProps
> = ({ links }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <BurgerButton onClick={() => setOpen(true)} />
      <Drawer
        anchor="left"
        open={open}
        onClose={close}
        data-testid="navbar-drawer"
        PaperProps={{
          sx: { width: 280, borderRadius: '0 16px 16px 0' },
        }}
      >
        <DrawerHeader onClose={close} />
        <Divider />
        <List sx={{ flex: 1, py: 1 }} role="menu">
          {links.map((l) => (
            <DrawerNavItem
              key={l.href}
              label={l.label}
              href={l.href}
              onClick={close}
            />
          ))}
        </List>
        <Divider />
        <DrawerToolLinks />
        <Divider />
        <DrawerFooter />
      </Drawer>
    </>
  );
};

export default MobileDrawer;
