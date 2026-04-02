'use client';

import React from 'react';
import {
  Icon,
} from '@shared/m3/data-display/Icon';
import s from '@shared/scss/modules/BurgerButton.module.scss';

/** Props for BurgerButton. */
export interface BurgerButtonProps {
  /** Click handler to open drawer. */
  onClick: () => void;
}

/**
 * Hamburger icon button for mobile nav.
 *
 * @param props - Component props.
 */
export const BurgerButton: React.FC<
  BurgerButtonProps
> = ({ onClick }) => (
  <button
    type="button"
    className={s.root}
    aria-label="Open menu"
    onClick={onClick}
    data-testid="navbar-hamburger"
  >
    <Icon size="md">menu</Icon>
  </button>
);

export default BurgerButton;
