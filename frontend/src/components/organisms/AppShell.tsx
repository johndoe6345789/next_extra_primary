'use client';

import React from 'react';
import {
  DrawerProvider,
  useDrawer,
} from '@shared/components/ui/DrawerContext';
import s from
  '@shared/scss/modules/AppShell.module.scss';

/** Inner shell that reads drawer state. */
const ShellInner: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { open } = useDrawer();
  return (
    <div
      className={[
        s.root,
        open ? s.shifted : '',
      ].join(' ')}
    >
      {children}
    </div>
  );
};

/**
 * App shell with drawer push effect.
 * Wraps entire page content.
 */
export const AppShell: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <DrawerProvider>
    <ShellInner>{children}</ShellInner>
  </DrawerProvider>
);

export default AppShell;
