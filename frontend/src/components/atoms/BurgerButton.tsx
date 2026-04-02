'use client';

import React from 'react';
import MuiIconButton from '@shared/m3/IconButton';
import MenuIcon from '@shared/icons/Menu';

/** Props for BurgerButton. */
export interface BurgerButtonProps {
  /** Click handler to open drawer. */
  onClick: () => void;
}

/**
 * Hamburger icon button, visible on xs/sm only.
 *
 * @param props - Component props.
 */
export const BurgerButton: React.FC<
  BurgerButtonProps
> = ({ onClick }) => (
  <MuiIconButton
    aria-label="Open menu"
    className="burger-btn"
    onClick={onClick}
    color="inherit"
    edge="start"
    data-testid="navbar-hamburger"
    sx={{ display: { xs: 'flex', md: 'none' } }}
  >
    <MenuIcon />
  </MuiIconButton>
);

export default BurgerButton;
