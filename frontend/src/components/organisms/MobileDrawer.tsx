'use client';

import React from 'react';
import Drawer from '@shared/m3/Drawer';
import List from '@shared/m3/List';
import Divider from '@shared/m3/Divider';
import {
  useDrawer,
  DRAWER_WIDTH,
} from '@shared/components/ui/DrawerContext';
import { DrawerHeader } from
  '../molecules/DrawerHeader';
import {
  DrawerNavItem,
} from '@shared/components/ui/DrawerNavItem';
import { DrawerFooter } from
  '../molecules/DrawerFooter';
import { DrawerToolLinks } from
  '../molecules/DrawerToolLinks';
import { BurgerButton } from '@shared/ui';

/** Navigation link shape. */
export interface NavLink {
  label: string;
  href: string;
}

/** Props for MobileDrawer. */
export interface MobileDrawerProps {
  links: NavLink[];
}

/**
 * Slide-out drawer. Uses DrawerContext
 * so AppShell can shift content.
 *
 * @param props - Component props.
 */
export const MobileDrawer: React.FC<
  MobileDrawerProps
> = ({ links }) => {
  const { open, setOpen, close } =
    useDrawer();
  return (
    <>
      <BurgerButton
        onClick={() => setOpen(true)}
      />
      <Drawer
        anchor="left"
        open={open}
        onClose={close}
        data-testid="navbar-drawer"
        PaperProps={{
          style: {
            width: `${DRAWER_WIDTH}px`,
            borderRadius:
              '0 16px 16px 0',
          },
        }}
      >
        <DrawerHeader onClose={close} />
        <Divider />
        <List
          sx={{ flex: 1, py: 1 }}
          role="menu"
        >
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
