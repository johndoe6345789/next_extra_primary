'use client';

import React, { useState } from 'react';
import MuiIconButton
  from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton
  from '@mui/material/ListItemButton';
import ListItemText
  from '@mui/material/ListItemText';
import Link from 'next/link';

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
 * Hamburger menu drawer for mobile viewports.
 *
 * @param props - Component props.
 */
export const MobileDrawer: React.FC<
  MobileDrawerProps
> = ({ links }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MuiIconButton
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        data-testid="navbar-hamburger"
        sx={{ display: { sm: 'none' } }}
      >
        <MenuIcon />
      </MuiIconButton>
      <Drawer
        anchor="left" open={open}
        onClose={() => setOpen(false)}
        data-testid="navbar-drawer"
      >
        <List sx={{ width: 240 }} role="menu">
          {links.map((l) => (
            <ListItemButton
              key={l.href} component={Link}
              href={l.href} role="menuitem"
              onClick={() => setOpen(false)}
            >
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};
