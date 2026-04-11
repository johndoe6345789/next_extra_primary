'use client';

import React from 'react';
import Drawer from '@shared/m3/Drawer';
import Divider from '@shared/m3/Divider';
import {
  useDrawer,
  DRAWER_WIDTH,
} from '@shared/components/ui/DrawerContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { DrawerHeader } from
  '../molecules/DrawerHeader';
import { BurgerButton } from '@shared/ui';
import { DrawerContent } from
  './DrawerContent';

/** Navigation link shape. */
export interface NavLink {
  label: string;
  href: string;
}

/** Props for MobileDrawer. */
export interface MobileDrawerProps {
  links: NavLink[];
  /** Search callback for drawer search. */
  onSearch?: (q: string) => void;
}

/**
 * Slide-out drawer. Uses DrawerContext
 * so AppShell can shift content.
 *
 * @param props - Component props.
 */
export const MobileDrawer: React.FC<
  MobileDrawerProps
> = ({ links, onSearch }) => {
  const { open, setOpen, close } =
    useDrawer();
  useScrollLock(open);
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
        PaperProps={{ style: {
          width: `${DRAWER_WIDTH}px`,
          borderRadius: '0 16px 16px 0',
          display: 'flex',
          flexDirection: 'column',
        } }}
      >
        <DrawerHeader onClose={close} />
        <Divider />
        <DrawerContent
          links={links}
          onSearch={onSearch ?? (() => {})}
          onClose={close}
        />
      </Drawer>
    </>
  );
};

export default MobileDrawer;
